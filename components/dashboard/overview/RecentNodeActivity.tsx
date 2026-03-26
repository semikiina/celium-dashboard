'use client';

/**
 * RecentNodeActivity
 * Renders a "Recent Node Activity" section on the Overview page.
 * Shows up to 6 recently-seen nodes in a 3-column grid. Each card
 * displays the node name, status badge, external ID, battery %, and RSSI.
 * Includes a "View all nodes" link to the full node list page.
 *
 * @prop nodes          — full array of Node objects (sorted by lastSeenAt desc internally)
 * @prop latestReadings — map of node.id → most recent Reading for that node
 */

import Link from 'next/link';
import { Battery, Signal } from 'lucide-react';
import { Node, Reading } from '@/types';
import { STATUS_COLOURS } from '@/lib/constants';

interface RecentNodeActivityProps {
  nodes: Node[];
  latestReadings: Record<string, Reading>;
}

const STATUS_LABEL: Record<string, string> = {
  online: 'active',
  offline: 'offline',
  warning: 'warning',
  unknown: 'unknown',
};

export function RecentNodeActivity({
  nodes,
  latestReadings,
}: RecentNodeActivityProps) {
  const recentNodes = [...nodes]
    .sort((a, b) => {
      if (!a.lastSeenAt && !b.lastSeenAt) return 0;
      if (!a.lastSeenAt) return 1;
      if (!b.lastSeenAt) return -1;
      return b.lastSeenAt.localeCompare(a.lastSeenAt);
    })
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-brand-blue/20 bg-brand-navy p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-white">
          Recent Node Activity
        </h2>
        <Link
          href="/nodes"
          className="font-body text-sm text-brand-cyan transition-colors hover:text-brand-cyan/80"
        >
          View all nodes &rarr;
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {recentNodes.map((node) => {
          const reading = latestReadings[node.id];
          const batteryPct = reading?.batteryPct ?? node.batteryPct;
          const rssi = reading?.rssi ?? null;
          const externalId = `NODE-${String(node.externalId).padStart(3, '0')}`;

          return (
            <Link
              key={node.id}
              href={`/nodes/${node.id}`}
              className="rounded-[10px] border border-brand-blue/10 bg-[#0a0f14] p-4 transition-colors hover:border-brand-blue/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-body text-base font-medium text-white">
                  {node.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-body text-xs font-medium ${STATUS_COLOURS[node.status]}`}
                >
                  {STATUS_LABEL[node.status]}
                </span>
              </div>
              <p className="mt-1 font-body text-xs text-zinc-500">
                {externalId}
              </p>
              <div className="mt-3 flex items-center gap-4">
                {batteryPct !== null && batteryPct !== undefined && (
                  <div className="flex items-center gap-1">
                    <Battery className="size-3 text-zinc-500" />
                    <span className="font-body text-xs text-zinc-500">
                      {batteryPct}%
                    </span>
                  </div>
                )}
                {rssi !== null && (
                  <div className="flex items-center gap-1">
                    <Signal className="size-3 text-zinc-500" />
                    <span className="font-body text-xs text-zinc-500">
                      {rssi} dBm
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
