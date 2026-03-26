/**
 * GET /api/nodes
 * Returns a flat array of all nodes in the network, ordered by creation date
 * (most recent first). Maps snake_case DB columns to camelCase.
 */

import { createClient } from '@/lib/supabase';
import { Node, NodeRow } from '@/types';
import { NextResponse } from 'next/server';

function mapRowToNode(row: NodeRow): Node {
  return {
    id: row.id,
    externalId: row.external_id,
    name: row.name,
    type: row.type,
    status: row.status,
    gatewayId: row.gateway_id,
    lat: row.lat,
    lng: row.lng,
    firmwareVer: row.firmware_ver,
    hardwareVer: row.hardware_ver,
    batteryPct: row.battery_pct,
    deployedAt: row.deployed_at,
    lastSeenAt: row.last_seen_at,
  };
}

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<NodeRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []).map(mapRowToNode));
}
