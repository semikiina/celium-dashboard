'use client';

/**
 * OverviewContent
 * Client component that fetches and renders all interactive content for the
 * Overview page. Isolated behind the client boundary so that the parent
 * page.tsx remains a server component, following the server-first architecture.
 *
 * Layout (matching Figma):
 *   1. Critical alert banner (conditional)
 *   2. Stat card strip (4 cards: Total Nodes, Active, Alerts, Coverage)
 *   3. Two-column panel: Network Health (left) + Recent Alerts (right)
 *   4. Recent Node Activity grid (6 node cards, 3×2)
 */

import { useOverviewData } from '@/hooks/useOverviewData';
import { ALERT_SEVERITY_VALUES } from '@/lib/constants';
import { AlertBanner } from '@/components/dashboard/overview/AlertBanner';
import { StatCardStrip } from '@/components/dashboard/overview/StatCardStrip';
import { NetworkHealthBar } from '@/components/dashboard/overview/NetworkHealthBar';
import { RecentAlerts } from '@/components/dashboard/overview/RecentAlerts';
import { RecentNodeActivity } from '@/components/dashboard/overview/RecentNodeActivity';

export function OverviewContent() {
  const {
    nodes,
    latestReadings,
    stats,
    activeAlerts,
    avgBatteryPct,
    kpi,
    isLoading,
    error,
  } = useOverviewData();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="font-body text-sm text-red-400">
          Failed to load overview data. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <div className="h-20 w-full animate-pulse rounded-xl bg-zinc-800" />
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[226px] animate-pulse rounded-xl bg-zinc-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-[454px] animate-pulse rounded-xl bg-zinc-800" />
          <div className="h-[454px] animate-pulse rounded-xl bg-zinc-800" />
        </div>
        <div className="h-[330px] animate-pulse rounded-xl bg-zinc-800" />
      </div>
    );
  }

  const criticalAlertCount = activeAlerts.filter(
    (a) => a.severity === ALERT_SEVERITY_VALUES.critical,
  ).length;

  return (
    <div className="space-y-6 p-8">
      <AlertBanner alerts={activeAlerts} />

      <StatCardStrip
        totalNodes={stats?.totalNodes ?? 0}
        onlineNodes={stats?.onlineNodes ?? 0}
        offlineNodes={stats?.offlineNodes ?? 0}
        alertCount={activeAlerts.length}
        criticalAlertCount={criticalAlertCount}
      />

      <div className="grid grid-cols-2 gap-6">
        <NetworkHealthBar
          avgBatteryPct={avgBatteryPct}
          avgRssi={kpi.avgRssi}
          activeCount={stats?.onlineNodes ?? 0}
          warningCount={stats?.warningNodes ?? 0}
          criticalAlerts={criticalAlertCount}
          offlineCount={stats?.offlineNodes ?? 0}
        />

        <RecentAlerts alerts={activeAlerts} nodes={nodes} />
      </div>

      <RecentNodeActivity nodes={nodes} latestReadings={latestReadings} />
    </div>
  );
}
