'use client';

/**
 * OverviewContent
 * Client component that fetches and renders all interactive content for the
 * Overview page. Isolated behind the client boundary so that the parent
 * page.tsx remains a server component, following the server-first architecture.
 *
 * Displays a critical-alert banner (when applicable), a KPI metric strip,
 * and a priority-sorted triage list of network nodes. Shows skeleton
 * placeholders while loading and an error message on failure.
 */

import { useOverviewData } from '@/hooks/useOverviewData';
import { AlertBanner } from '@/components/dashboard/overview/AlertBanner';
import { KpiStrip } from '@/components/dashboard/overview/KpiStrip';
import { TriageNodeList } from '@/components/dashboard/overview/TriageNodeList';

export function OverviewContent() {
  const { nodes, latestReadings, kpi, activeAlerts, isLoading, error } =
    useOverviewData();

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
        <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-zinc-800"
            />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-zinc-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertBanner alerts={activeAlerts} />

      <div className="space-y-6 p-8">
        <KpiStrip
          nodesOnline={kpi.nodesOnline}
          messagesToday={kpi.messagesToday}
          avgRssi={kpi.avgRssi}
          activeAlerts={kpi.activeAlerts}
        />

        <TriageNodeList nodes={nodes} latestReadings={latestReadings} />
      </div>
    </>
  );
}
