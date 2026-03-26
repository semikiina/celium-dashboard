/**
 * OverviewPage
 * The primary landing screen of the Celium Dashboard. Renders a server-side
 * page shell (heading, description) and delegates interactive content
 * (alert banner, KPI strip, triage node list) to the OverviewContent client
 * component, following the server-first architecture pattern.
 */

import { OverviewContent } from '@/components/dashboard/overview/OverviewContent';

export default function OverviewPage() {
  return (
    <>
      <div className="px-8 pt-8">
        <h1 className="font-heading text-3xl font-bold text-zinc-100">
          Network Overview
        </h1>
        <p className="mt-1 font-body text-sm text-zinc-400">
          Real-time monitoring of the Celium mesh network
        </p>
      </div>

      <OverviewContent />
    </>
  );
}
