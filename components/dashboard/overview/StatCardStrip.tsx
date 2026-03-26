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
import { StatCard } from '@/components/dashboard/overview/StatCard';

interface StatCardStripProps {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  alertCount: number;
  criticalAlertCount: number;
}

const GRADIENT_CYAN_BLUE =
  'linear-gradient(135deg, #5DD4D8, #1784E3)';
const GRADIENT_GREEN =
  'linear-gradient(135deg, #00BC7D, #009966)';
const GRADIENT_RED =
  'linear-gradient(135deg, #FB2C36, #E7000B)';
const GRADIENT_BLUE =
  'linear-gradient(135deg, #1784E3, rgba(23,132,227,0.7))';

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
        gradient={GRADIENT_CYAN_BLUE}
        value={totalNodes}
        label="Total Nodes"
        subtitle={`${onlineNodes} active, ${offlineNodes} offline`}
      />

      <StatCard
        icon={<Activity />}
        gradient={GRADIENT_GREEN}
        value={onlineNodes}
        label="Active Nodes"
        subtitle={`${operationalPct}% operational`}
      />

      <StatCard
        icon={<AlertTriangle />}
        gradient={GRADIENT_RED}
        value={alertCount}
        label="Alerts"
        subtitle={`${criticalAlertCount} critical`}
      />

      <StatCard
        icon={<MapPin />}
        gradient={GRADIENT_BLUE}
        value="~45,000 km²"
        label="Coverage Area"
        subtitle="Uptime: 99.2%"
      />
    </div>
  );
}
