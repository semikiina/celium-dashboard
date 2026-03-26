'use client';

/**
 * useOverviewData
 * Single SWR-based hook that fetches and computes all data needed by the
 * Overview page. The Overview page imports only this hook — it does not call
 * multiple hooks or compute values inline.
 *
 * Fetches:
 *  - GET /api/nodes            — full node list
 *  - GET /api/network/stats    — pre-computed NetworkStats
 *  - GET /api/alerts?resolved=false — active unresolved alerts
 *  - GET /api/nodes/latest-readings — most recent Reading per node
 *
 * Returns:
 *  - nodes: Node[]
 *  - latestReadings: Record<string, Reading>  — keyed by node id
 *  - kpi: { nodesOnline, messagesToday, avgRssi, activeAlerts }
 *  - activeAlerts: Alert[]
 *  - isLoading: boolean
 *  - error: unknown
 */

import useSWR from 'swr';
import {
  Alert,
  NetworkStats,
  Node,
  OverviewKpi,
  Reading,
  UseOverviewDataReturn,
} from '@/types';
import { REFRESH_INTERVAL } from '@/lib/constants';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * Returns true if the given ISO timestamp falls within the current UTC day.
 */
function isWithinCurrentUtcDay(timestamp: string): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate()
  );
}

export function useOverviewData(): UseOverviewDataReturn {
  const {
    data: nodesData,
    isLoading: nodesLoading,
    error: nodesError,
  } = useSWR<Node[]>('/api/nodes', fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useSWR<NetworkStats>('/api/network/stats', fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });

  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError,
  } = useSWR<Alert[]>('/api/alerts?resolved=false', fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });

  const {
    data: readingsData,
    isLoading: readingsLoading,
    error: readingsError,
  } = useSWR<Reading[]>('/api/nodes/latest-readings', fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });

  const isLoading =
    nodesLoading || statsLoading || alertsLoading || readingsLoading;
  const error = nodesError || statsError || alertsError || readingsError;

  const nodes = nodesData ?? [];
  const activeAlerts = alertsData ?? [];
  const readings = readingsData ?? [];

  const latestReadings: Record<string, Reading> = {};
  for (const reading of readings) {
    latestReadings[reading.nodeId] = reading;
  }

  const messagesToday = readings.filter((r) =>
    isWithinCurrentUtcDay(r.timestamp),
  ).length;

  const rssiValues = readings
    .map((r) => r.rssi)
    .filter((v): v is number => v !== null);
  const avgRssi =
    rssiValues.length > 0
      ? Math.round(
          (rssiValues.reduce((sum, v) => sum + v, 0) / rssiValues.length) * 10,
        ) / 10
      : 0;

  const batteryValues = readings
    .map((r) => r.batteryPct)
    .filter((v): v is number => v !== null);
  const avgBatteryPct =
    batteryValues.length > 0
      ? Math.round(
          batteryValues.reduce((sum, v) => sum + v, 0) / batteryValues.length,
        )
      : 0;

  const kpi: OverviewKpi = {
    nodesOnline: statsData?.onlineNodes ?? 0,
    messagesToday,
    avgRssi,
    activeAlerts: activeAlerts.length,
  };

  return {
    nodes,
    latestReadings,
    kpi,
    stats: statsData,
    activeAlerts,
    avgBatteryPct,
    isLoading,
    error,
  };
}
