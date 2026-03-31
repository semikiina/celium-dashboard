/**
 * StatCardStrip
 * Renders a horizontal row of 4 StatCard tiles on the Overview page.
 * Shows: Total Nodes, Active Nodes, Alerts count, and Coverage Area.
 * Each card has a distinct gradient icon matching the Figma design.
 *
 * @prop totalNodes   — total number of nodes in the network
 * @prop onlineNodes  — count of nodes currently online
 * @prop offlineNodes — count of nodes currently offline
 * @prop alertCount   — count of unresolved alerts
 * @prop criticalAlertCount — count of critical alerts (for subtitle)
 */

import { Activity, AlertTriangle, MapPin, Radio } from 'lucide-react';
import { STAT_CARD_ICON_GRADIENT_CLASSES } from '@/lib/constants';
import { StatCard } from '@/components/dashboard/overview/StatCard';

interface StatCardStripProps {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  alertCount: number;
  criticalAlertCount: number;
}

export function StatCardStrip({
  totalNodes,
  onlineNodes,
  offlineNodes,
  alertCount,
  criticalAlertCount,
}: StatCardStripProps) {
  const operationalPct =
    totalNodes > 0
      ? ((onlineNodes / totalNodes) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        icon={<Radio />}
        iconClassName={STAT_CARD_ICON_GRADIENT_CLASSES.cyanBlue}
        value={totalNodes}
        label="Total Nodes"
        subtitle={`${onlineNodes} active, ${offlineNodes} offline`}
      />

      <StatCard
        icon={<Activity />}
        iconClassName={STAT_CARD_ICON_GRADIENT_CLASSES.green}
        value={onlineNodes}
        label="Active Nodes"
        subtitle={`${operationalPct}% operational`}
      />

      <StatCard
        icon={<AlertTriangle />}
        iconClassName={STAT_CARD_ICON_GRADIENT_CLASSES.red}
        value={alertCount}
        label="Alerts"
        subtitle={`${criticalAlertCount} critical`}
      />

      <StatCard
        icon={<MapPin />}
        iconClassName={STAT_CARD_ICON_GRADIENT_CLASSES.blueFade}
        value="~45,000 km²"
        label="Coverage Area"
        subtitle="Uptime: 99.2%"
      />
    </div>
  );
}
