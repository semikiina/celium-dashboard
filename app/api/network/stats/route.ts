/**
 * GET /api/network/stats
 * Returns pre-computed aggregate NetworkStats derived from the nodes and alerts
 * tables. Runs two lightweight queries and assembles the stats object in JS.
 */

import { createClient } from '@/lib/supabase';
import { NetworkStats, NodeRow, AlertRow } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const [nodesResult, alertsResult] = await Promise.all([
    supabase.from('nodes').select('*').returns<NodeRow[]>(),
    supabase
      .from('alerts')
      .select('*')
      .eq('resolved', false)
      .returns<AlertRow[]>(),
  ]);

  if (nodesResult.error) {
    return NextResponse.json(
      { error: nodesResult.error.message },
      { status: 500 },
    );
  }

  if (alertsResult.error) {
    return NextResponse.json(
      { error: alertsResult.error.message },
      { status: 500 },
    );
  }

  const nodes = nodesResult.data ?? [];
  const alerts = alertsResult.data ?? [];

  const stats: NetworkStats = {
    totalNodes: nodes.length,
    onlineNodes: nodes.filter((n) => n.status === 'online').length,
    offlineNodes: nodes.filter((n) => n.status === 'offline').length,
    warningNodes: nodes.filter((n) => n.status === 'warning').length,
    activeAlerts: alerts.length,
    gatewayCount: nodes.filter((n) => n.type === 'gateway').length,
    endNodeCount: nodes.filter((n) => n.type === 'end_node').length,
  };

  return NextResponse.json(stats);
}
