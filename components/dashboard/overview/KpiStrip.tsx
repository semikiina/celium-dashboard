/**
 * KpiStrip
 * Renders a horizontal row of 4 KpiCard components displaying key network
 * metrics. Not wired by the current Overview route — `OverviewContent` uses
 * `StatCardStrip` for the top metric row instead. Kept for reuse or alternate
 * overview layouts.
 *
 * @prop nodesOnline    — count of nodes currently online
 * @prop messagesToday  — count of readings received across all nodes in the current UTC day
 * @prop avgRssi        — average RSSI across all nodes' latest readings (1 dp), null if no data
 * @prop activeAlerts   — count of unresolved alerts
 */

import { Bell, Cpu, Radio, Signal } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/overview/KpiCard';

interface KpiStripProps {
  nodesOnline: number;
  messagesToday: number;
  avgRssi: number | null;
  activeAlerts: number;
}

function rssiState(rssi: number | null): 'green' | 'amber' | 'red' {
  if (rssi === null || rssi < -120) return 'red';
  if (rssi >= -100) return 'green';
  return 'amber';
}

export function KpiStrip({
  nodesOnline,
  messagesToday,
  avgRssi,
  activeAlerts,
}: KpiStripProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <KpiCard
        label="Nodes Online"
        value={nodesOnline}
        icon={<Cpu />}
        state={nodesOnline > 0 ? 'green' : 'red'}
      />

      <KpiCard
        label="Messages Today"
        value={messagesToday}
        icon={<Radio />}
        state="neutral"
      />

      <KpiCard
        label="Avg RSSI"
        value={avgRssi !== null ? `${avgRssi} dBm` : '—'}
        icon={<Signal />}
        state={rssiState(avgRssi)}
      />

      <KpiCard
        label="Active Alerts"
        value={activeAlerts}
        icon={<Bell />}
        state={activeAlerts > 0 ? 'red' : 'green'}
      />
    </div>
  );
}
