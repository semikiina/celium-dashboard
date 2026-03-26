/**
 * One-off Supabase seed script for development.
 * It resets nodes, readings, and alerts with realistic Arctic mock telemetry.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  AlertSeverity,
  InsertedSeedNode,
  NodeStatus,
  NodeType,
  SeedAlertDefinition,
  SeedNodeDefinition,
} from '../types';

const READING_POINTS_PER_NODE = 20;
const READING_INTERVAL_MINUTES = 30;

const NODE_TYPE_VALUES: Record<'gateway' | 'relay' | 'endNode', NodeType> = {
  gateway: 'gateway',
  relay: 'relay',
  endNode: 'end_node',
};

const NODE_STATUS_VALUES: Record<
  'online' | 'offline' | 'warning' | 'unknown',
  NodeStatus
> = {
  online: 'online',
  offline: 'offline',
  warning: 'warning',
  unknown: 'unknown',
};

const ALERT_SEVERITY_VALUES: Record<
  'info' | 'warning' | 'critical',
  AlertSeverity
> = {
  info: 'info',
  warning: 'warning',
  critical: 'critical',
};

const ALERT_TYPE_VALUES = {
  nodeOffline: 'node_offline',
  signalLost: 'signal_lost',
  lowBattery: 'low_battery',
  firmwareUpdateAvailable: 'firmware_update_available',
  nodeReassociated: 'node_reassociated',
} as const;

function getSupabaseCredentials(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  return { url, key };
}

function parseEnvFileLine(line: string): [string, string] | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const separatorIndex = trimmed.indexOf('=');
  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed
    .slice(separatorIndex + 1)
    .trim()
    .replace(/^['"]|['"]$/g, '');

  if (!key) {
    return null;
  }

  return [key, value];
}

function loadLocalEnvFallback(): void {
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const candidatePath of candidatePaths) {
    if (!fs.existsSync(candidatePath)) {
      continue;
    }

    const fileContent = fs.readFileSync(candidatePath, 'utf8');
    const lines = fileContent.split('\n');

    for (const line of lines) {
      const parsed = parseEnvFileLine(line);
      if (!parsed) {
        continue;
      }
      const [key, value] = parsed;
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function assertNoError(
  operation: string,
  error: { message: string } | null,
): void {
  if (error) {
    throw new Error(`[${operation}] ${error.message}`);
  }
}

function writeProgress(message: string): void {
  process.stdout.write(`${message}\n`);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function deriveBatteryPct(voltage: number): number {
  const minVoltage = 3.3;
  const maxVoltage = 4.2;
  const normalized = (voltage - minVoltage) / (maxVoltage - minVoltage);
  return Math.round(clamp(normalized * 100, 0, 100));
}

function jitterCoordinate(value: number, maxOffset: number): number {
  return round(value + randomInRange(-maxOffset, maxOffset), 7);
}

function buildNodeDefinitions(): SeedNodeDefinition[] {
  const gateways: SeedNodeDefinition[] = [
    {
      key: 'gateway-01',
      externalId: 1,
      name: 'Gateway-01',
      type: NODE_TYPE_VALUES.gateway,
      status: NODE_STATUS_VALUES.online,
      parentKey: null,
      lat: 69.6492,
      lng: 18.9553,
      firmwareVer: '1.4.2',
      hardwareVer: 'rev-C3',
      mobile: false,
    },
    {
      key: 'gateway-02',
      externalId: 2,
      name: 'Gateway-02',
      type: NODE_TYPE_VALUES.gateway,
      status: NODE_STATUS_VALUES.online,
      parentKey: null,
      lat: 69.9689,
      lng: 23.2717,
      firmwareVer: '1.4.2',
      hardwareVer: 'rev-C3',
      mobile: false,
    },
  ];

  const relays: SeedNodeDefinition[] = [
    {
      key: 'relay-01',
      externalId: 101,
      name: 'Relay-01',
      type: NODE_TYPE_VALUES.relay,
      status: NODE_STATUS_VALUES.online,
      parentKey: 'gateway-01',
      lat: 69.7204,
      lng: 20.0202,
      firmwareVer: '1.3.9',
      hardwareVer: 'rev-C2',
      mobile: false,
    },
    {
      key: 'relay-02',
      externalId: 102,
      name: 'Relay-02',
      type: NODE_TYPE_VALUES.relay,
      status: NODE_STATUS_VALUES.online,
      parentKey: 'gateway-02',
      lat: 69.8422,
      lng: 21.472,
      firmwareVer: '1.3.9',
      hardwareVer: 'rev-C2',
      mobile: false,
    },
    {
      key: 'relay-03',
      externalId: 103,
      name: 'Relay-03',
      type: NODE_TYPE_VALUES.relay,
      status: NODE_STATUS_VALUES.warning,
      parentKey: 'gateway-02',
      lat: 69.9064,
      lng: 22.4097,
      firmwareVer: '1.3.8',
      hardwareVer: 'rev-C2',
      mobile: false,
    },
  ];

  const endNodes: SeedNodeDefinition[] = [
    {
      key: 'node-001',
      externalId: 201,
      name: 'Node-001',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.online,
      parentKey: 'relay-01',
      lat: 69.7063,
      lng: 20.0714,
      firmwareVer: '1.2.4',
      hardwareVer: 'rev-C1',
      mobile: false,
    },
    {
      key: 'node-002',
      externalId: 202,
      name: 'Node-002',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.online,
      parentKey: 'relay-01',
      lat: 69.6893,
      lng: 20.1119,
      firmwareVer: '1.2.4',
      hardwareVer: 'rev-C1',
      mobile: false,
    },
    {
      key: 'node-003',
      externalId: 203,
      name: 'Node-003',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.warning,
      parentKey: 'relay-02',
      lat: 69.8534,
      lng: 21.5631,
      firmwareVer: '1.2.3',
      hardwareVer: 'rev-C1',
      mobile: false,
    },
    {
      key: 'node-004',
      externalId: 204,
      name: 'Node-004',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.offline,
      parentKey: 'relay-02',
      lat: 69.8642,
      lng: 21.6012,
      firmwareVer: '1.2.1',
      hardwareVer: 'rev-C1',
      mobile: false,
    },
    {
      key: 'node-005',
      externalId: 205,
      name: 'Node-005',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.online,
      parentKey: 'gateway-01',
      lat: 69.6579,
      lng: 18.9921,
      firmwareVer: '1.2.4',
      hardwareVer: 'rev-C1',
      mobile: true,
    },
    {
      key: 'node-006',
      externalId: 206,
      name: 'Node-006',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.warning,
      parentKey: 'relay-03',
      lat: 69.9181,
      lng: 22.5126,
      firmwareVer: '1.2.2',
      hardwareVer: 'rev-C1',
      mobile: false,
    },
    {
      key: 'node-007',
      externalId: 207,
      name: 'Node-007',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.offline,
      parentKey: 'gateway-02',
      lat: 69.9545,
      lng: 23.1598,
      firmwareVer: '1.1.9',
      hardwareVer: 'rev-C1',
      mobile: false,
    },
    {
      key: 'node-008',
      externalId: 208,
      name: 'Node-008',
      type: NODE_TYPE_VALUES.endNode,
      status: NODE_STATUS_VALUES.online,
      parentKey: 'relay-03',
      lat: 69.9328,
      lng: 22.4703,
      firmwareVer: '1.2.4',
      hardwareVer: 'rev-C1',
      mobile: true,
    },
  ];

  return [...gateways, ...relays, ...endNodes];
}

function getReadingSignalBias(status: NodeStatus): number {
  if (status === NODE_STATUS_VALUES.offline) {
    return -16;
  }
  if (status === NODE_STATUS_VALUES.warning) {
    return -8;
  }
  return 0;
}

async function clearExistingData(
  supabase: SupabaseClient,
): Promise<void> {
  const { error: alertsDeleteError } = await supabase
    .from('alerts')
    .delete()
    .not('id', 'is', null);
  assertNoError('Delete alerts', alertsDeleteError);

  const { error: readingsDeleteError } = await supabase
    .from('readings')
    .delete()
    .not('id', 'is', null);
  assertNoError('Delete readings', readingsDeleteError);

  const { error: nodesDeleteError } = await supabase
    .from('nodes')
    .delete()
    .not('id', 'is', null);
  assertNoError('Delete nodes', nodesDeleteError);
}

async function seedNodes(
  supabase: SupabaseClient,
): Promise<Map<string, InsertedSeedNode>> {
  const definitions = buildNodeDefinitions();
  const byKey = new Map(definitions.map((item) => [item.key, item]));

  const orderedByDependency = [
    ...definitions.filter((node) => node.type === NODE_TYPE_VALUES.gateway),
    ...definitions.filter((node) => node.type === NODE_TYPE_VALUES.relay),
    ...definitions.filter((node) => node.type === NODE_TYPE_VALUES.endNode),
  ];

  const insertedByKey = new Map<string, InsertedSeedNode>();
  const now = new Date();

  for (const node of orderedByDependency) {
    const parentId =
      node.parentKey === null ? null : insertedByKey.get(node.parentKey)?.id;
    if (node.parentKey && !parentId) {
      throw new Error(
        `Parent node "${node.parentKey}" was not inserted before "${node.key}".`,
      );
    }

    const deployedAt = new Date(
      now.getTime() - randomInRange(45, 360) * 24 * 60 * 60 * 1000,
    );

    const lastSeenAt =
      node.status === NODE_STATUS_VALUES.offline
        ? new Date(now.getTime() - randomInRange(6, 72) * 60 * 60 * 1000)
        : new Date(now.getTime() - randomInRange(1, 15) * 60 * 1000);

    const { data, error } = await supabase
      .from('nodes')
      .insert({
        external_id: node.externalId,
        name: node.name,
        type: node.type,
        status: node.status,
        gateway_id: parentId,
        lat: node.lat,
        lng: node.lng,
        firmware_ver: node.firmwareVer,
        hardware_ver: node.hardwareVer,
        deployed_at: deployedAt.toISOString(),
        last_seen_at: lastSeenAt.toISOString(),
      })
      .select('id, external_id, name')
      .single();

    assertNoError(`Insert node ${node.name}`, error);
    if (!data) {
      throw new Error(`Insert node ${node.name} returned no row.`);
    }

    insertedByKey.set(node.key, {
      id: String(data.id),
      external_id: Number(data.external_id),
      name: String(data.name),
    });
  }

  // Ensure all definitions were seeded and lookup map is complete.
  for (const definition of definitions) {
    if (!insertedByKey.has(definition.key) || !byKey.has(definition.key)) {
      throw new Error(`Missing inserted node for key "${definition.key}".`);
    }
  }

  return insertedByKey;
}

async function seedReadings(
  supabase: SupabaseClient,
  insertedByKey: Map<string, InsertedSeedNode>,
): Promise<void> {
  const definitions = buildNodeDefinitions();
  const now = new Date();
  const rows: Record<string, unknown>[] = [];

  for (const definition of definitions) {
    const insertedNode = insertedByKey.get(definition.key);
    if (!insertedNode) {
      throw new Error(`Node "${definition.key}" not found when seeding readings.`);
    }

    for (let index = 0; index < READING_POINTS_PER_NODE; index += 1) {
      const timestamp = new Date(
        now.getTime() - index * READING_INTERVAL_MINUTES * 60 * 1000,
      );

      const signalBias = getReadingSignalBias(definition.status);
      const hopCount =
        definition.type === NODE_TYPE_VALUES.gateway
          ? 0
          : Math.min(
              3,
              definition.type === NODE_TYPE_VALUES.relay
                ? Math.round(randomInRange(1, 2))
                : Math.round(randomInRange(1, 3)),
            );

      const temperature = round(randomInRange(-5, 15), 2);
      const humidity = round(randomInRange(40, 90), 2);
      const pressure = round(randomInRange(980, 1020), 2);
      const rssi = Math.round(clamp(randomInRange(-108, -82) + signalBias, -120, -80));
      const snr = round(clamp(randomInRange(-2, 10) + signalBias / 4, -5, 10), 2);
      const spreadingFactor = Math.round(randomInRange(7, 12));

      let batteryVoltage = round(randomInRange(3.55, 4.2), 3);
      if (definition.status === NODE_STATUS_VALUES.warning) {
        batteryVoltage = round(randomInRange(3.35, 3.62), 3);
      } else if (definition.status === NODE_STATUS_VALUES.offline) {
        batteryVoltage = round(randomInRange(3.3, 3.55), 3);
      }
      const batteryPct = deriveBatteryPct(batteryVoltage);
      const seqNum =
        definition.externalId * 1000 + (READING_POINTS_PER_NODE - index);

      rows.push({
        node_id: insertedNode.id,
        timestamp: timestamp.toISOString(),
        temperature,
        humidity,
        pressure,
        rssi,
        snr,
        spreading_factor: spreadingFactor,
        battery_voltage: batteryVoltage,
        battery_pct: batteryPct,
        hop_count: hopCount,
        seq_num: seqNum,
        raw_payload: {
          node: {
            id: definition.externalId,
            name: definition.name,
            type: definition.type,
            firmware_ver: definition.firmwareVer,
            hardware_ver: definition.hardwareVer,
          },
          gateway_id:
            definition.parentKey === null
              ? null
              : insertedByKey.get(definition.parentKey)?.external_id ?? null,
          timestamp: timestamp.toISOString(),
          sensors: {
            temperature,
            humidity,
            pressure,
          },
          radio: {
            rssi,
            snr,
            spreading_factor: spreadingFactor,
          },
          power: {
            battery_voltage: batteryVoltage,
            battery_pct: batteryPct,
          },
          network: {
            hop_count: hopCount,
            seq_num: seqNum,
          },
          mobile: definition.mobile,
          location: {
            lat: jitterCoordinate(definition.lat, 0.0035),
            lng: jitterCoordinate(definition.lng, 0.0035),
          },
        },
      });
    }
  }

  const { error } = await supabase.from('readings').insert(rows);
  assertNoError('Insert readings', error);
}

async function seedAlerts(
  supabase: SupabaseClient,
  insertedByKey: Map<string, InsertedSeedNode>,
): Promise<void> {
  const alerts: SeedAlertDefinition[] = [
    {
      nodeKey: 'node-004',
      severity: ALERT_SEVERITY_VALUES.critical,
      type: ALERT_TYPE_VALUES.nodeOffline,
      message: 'Node-004 has not reported for over 6 hours.',
      resolved: false,
      createdAtOffsetHours: 6,
      resolvedAfterHours: null,
    },
    {
      nodeKey: 'relay-03',
      severity: ALERT_SEVERITY_VALUES.critical,
      type: ALERT_TYPE_VALUES.signalLost,
      message: 'Relay-03 upstream signal to Gateway-02 is unstable.',
      resolved: true,
      createdAtOffsetHours: 12,
      resolvedAfterHours: 2,
    },
    {
      nodeKey: 'node-003',
      severity: ALERT_SEVERITY_VALUES.warning,
      type: ALERT_TYPE_VALUES.lowBattery,
      message: 'Node-003 battery is below 25%.',
      resolved: false,
      createdAtOffsetHours: 3,
      resolvedAfterHours: null,
    },
    {
      nodeKey: 'node-006',
      severity: ALERT_SEVERITY_VALUES.warning,
      type: ALERT_TYPE_VALUES.lowBattery,
      message: 'Node-006 battery is below 20%.',
      resolved: true,
      createdAtOffsetHours: 18,
      resolvedAfterHours: 4,
    },
    {
      nodeKey: 'gateway-01',
      severity: ALERT_SEVERITY_VALUES.info,
      type: ALERT_TYPE_VALUES.firmwareUpdateAvailable,
      message: 'Firmware 1.4.3 available for Gateway-01.',
      resolved: false,
      createdAtOffsetHours: 10,
      resolvedAfterHours: null,
    },
    {
      nodeKey: 'node-008',
      severity: ALERT_SEVERITY_VALUES.info,
      type: ALERT_TYPE_VALUES.nodeReassociated,
      message: 'Node-008 re-associated to Relay-03 after route optimization.',
      resolved: true,
      createdAtOffsetHours: 8,
      resolvedAfterHours: 1,
    },
  ];

  const now = new Date();
  const rows: Record<string, unknown>[] = alerts.map((alert) => {
    const seededNode = insertedByKey.get(alert.nodeKey);
    if (!seededNode) {
      throw new Error(`Node "${alert.nodeKey}" not found when seeding alerts.`);
    }

    const createdAt = new Date(
      now.getTime() - alert.createdAtOffsetHours * 60 * 60 * 1000,
    );
    const resolvedAt =
      alert.resolved && alert.resolvedAfterHours !== null
        ? new Date(createdAt.getTime() + alert.resolvedAfterHours * 60 * 60 * 1000)
        : null;

    return {
      node_id: seededNode.id,
      severity: alert.severity,
      type: alert.type,
      message: alert.message,
      resolved: alert.resolved,
      created_at: createdAt.toISOString(),
      resolved_at: resolvedAt ? resolvedAt.toISOString() : null,
    };
  });

  const { error } = await supabase.from('alerts').insert(rows);
  assertNoError('Insert alerts', error);
}

async function main(): Promise<void> {
  loadLocalEnvFallback();
  const { url, key } = getSupabaseCredentials();
  const supabase: SupabaseClient = createClient(url, key);

  writeProgress('Starting seed: clearing existing data...');
  await clearExistingData(supabase);
  writeProgress('Existing rows cleared.');

  writeProgress('Seeding nodes...');
  const insertedByKey = await seedNodes(supabase);
  writeProgress(`Seeded ${insertedByKey.size} nodes.`);

  writeProgress('Seeding readings...');
  await seedReadings(supabase, insertedByKey);
  writeProgress(
    `Seeded ${insertedByKey.size * READING_POINTS_PER_NODE} readings.`,
  );

  writeProgress('Seeding alerts...');
  await seedAlerts(supabase, insertedByKey);
  writeProgress('Seeded 6 alerts.');

  writeProgress('Seeding completed successfully.');
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`Seed failed: ${error.message}`);
  } else {
    console.error('Seed failed with an unknown error.');
  }
  process.exit(1);
});
