/**
 * Shared TypeScript types used across the Celium Dashboard codebase.
 */

export type NodeType = 'gateway' | 'relay' | 'end_node';

export type NodeStatus = 'online' | 'offline' | 'warning' | 'unknown';

export type AlertSeverity = 'info' | 'warning' | 'critical';

/**
 * Represents a single network node in the Celium mesh.
 */
export interface Node {
  id: string;
  externalId: number;
  name: string;
  type: NodeType;
  status: NodeStatus;
  gatewayId: string | null;
  lat: number | null;
  lng: number | null;
  firmwareVer: string | null;
  hardwareVer: string | null;
  batteryPct: number | null;
  deployedAt: string | null;
  lastSeenAt: string | null;
}

/**
 * Represents one telemetry reading transmitted by a node.
 */
export interface Reading {
  id: string;
  nodeId: string;
  timestamp: string;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  rssi: number | null;
  snr: number | null;
  spreadingFactor: number | null;
  batteryVoltage: number | null;
  batteryPct: number | null;
  hopCount: number | null;
  seqNum: number | null;
  rawPayload: Record<string, unknown> | null;
}

/**
 * Represents a system alert raised by node or network conditions.
 */
export interface Alert {
  id: string;
  nodeId: string | null;
  severity: AlertSeverity;
  type: string;
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

/**
 * Represents aggregate network health and count metrics.
 */
export interface NetworkStats {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  warningNodes: number;
  unknownNodes: number;
  activeAlerts: number;
  gatewayCount: number;
  endNodeCount: number;
}

/**
 * Raw row shape returned by Supabase for the nodes table.
 * Used at the API layer for type-safe snake_case → camelCase mapping.
 */
export interface NodeRow {
  id: string;
  external_id: number;
  name: string;
  type: NodeType;
  status: NodeStatus;
  gateway_id: string | null;
  lat: number | null;
  lng: number | null;
  firmware_ver: string | null;
  hardware_ver: string | null;
  battery_pct: number | null;
  deployed_at: string | null;
  last_seen_at: string | null;
}

/**
 * Raw row shape returned by Supabase for the alerts table.
 * Used at the API layer for type-safe snake_case → camelCase mapping.
 */
export interface AlertRow {
  id: string;
  node_id: string | null;
  severity: AlertSeverity;
  type: string;
  message: string;
  resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}

/**
 * Raw row shape returned by Supabase for the readings table.
 * Used at the API layer for type-safe snake_case → camelCase mapping.
 */
export interface ReadingRow {
  id: string;
  node_id: string;
  timestamp: string;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  rssi: number | null;
  snr: number | null;
  spreading_factor: number | null;
  battery_voltage: number | null;
  battery_pct: number | null;
  hop_count: number | null;
  seq_num: number | null;
  raw_payload: Record<string, unknown> | null;
}

/**
 * KPI metrics computed for the Overview page.
 */
export interface OverviewKpi {
  nodesOnline: number;
  messagesToday: number;
  avgRssi: number;
  activeAlerts: number;
}

/**
 * Return type for the useOverviewData hook.
 */
export interface UseOverviewDataReturn {
  nodes: Node[];
  latestReadings: Record<string, Reading>;
  kpi: OverviewKpi;
  stats: NetworkStats | undefined;
  activeAlerts: Alert[];
  avgBatteryPct: number;
  isLoading: boolean;
  error: unknown;
}

/**
 * SeedNodeDefinition
 * Defines one deterministic node entry used by the development seed script.
 */
export interface SeedNodeDefinition {
  key: string;
  externalId: number;
  name: string;
  type: NodeType;
  status: NodeStatus;
  parentKey: string | null;
  lat: number;
  lng: number;
  firmwareVer: string;
  hardwareVer: string;
  mobile: boolean;
}

/**
 * InsertedSeedNode
 * Minimal node row shape selected back after insert.
 */
export interface InsertedSeedNode {
  id: string;
  external_id: number;
  name: string;
}

/**
 * SeedAlertDefinition
 * Defines one deterministic alert entry used by the development seed script.
 */
export interface SeedAlertDefinition {
  nodeKey: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  resolved: boolean;
  createdAtOffsetHours: number;
  resolvedAfterHours: number | null;
}
