'use client';

/**
 * NodeRow
 * Renders a single horizontal row in the triage node list.
 * Purely presentational — all data comes via props.
 *
 * Columns (left → right):
 *  1. Name + node type short label (C1/C2/C3)
 *  2. Status badge (NodeStatusBadge)
 *  3. Last seen (relative time)
 *  4. RSSI value from the latest reading
 *  5. Battery bar with percentage
 *
 * @prop node — the full Node object
 * @prop latestReading — optional most-recent Reading for RSSI data
 */

import Link from 'next/link';
import { Node, Reading } from '@/types';
import { NODE_TYPE_SHORT } from '@/lib/constants';
import { cn, formatRelativeTime } from '@/lib/utils';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';

interface NodeRowProps {
  node: Node;
  latestReading?: Reading;
}

function getBatteryColour(pct: number): string {
  if (pct >= 50) return 'bg-green-500';
  if (pct >= 20) return 'bg-amber-500';
  return 'bg-red-500';
}

export function NodeRow({ node, latestReading }: NodeRowProps) {
  const rssi = latestReading?.rssi ?? null;
  const batteryPct = node.batteryPct;

  return (
    <Link
      href={`/nodes/${node.id}`}
      className={cn(
        'flex w-full items-center gap-6 border-b border-border bg-card px-4 py-3',
        'transition-colors hover:bg-muted/80',
      )}
    >
      {/* Name + type short label */}
      <div className="min-w-[140px] flex-1">
        <p className="font-body font-medium text-foreground">{node.name}</p>
        <p className="font-body text-xs text-muted-foreground">
          {NODE_TYPE_SHORT[node.type]}
        </p>
      </div>

      {/* Status badge */}
      <div className="w-[90px] shrink-0">
        <NodeStatusBadge status={node.status} />
      </div>

      {/* Last seen (relative); suppressHydrationWarning: Date.now() differs between SSR and browser */}
      <div className="w-[100px] shrink-0">
        <p className="font-body text-sm text-muted-foreground" suppressHydrationWarning>
          {formatRelativeTime(node.lastSeenAt)}
        </p>
      </div>

      {/* RSSI */}
      <div className="w-[90px] shrink-0">
        {rssi !== null ? (
          <p className="font-body text-sm text-foreground">
            {rssi}{' '}
            <span className="text-muted-foreground">dBm</span>
          </p>
        ) : (
          <p className="font-body text-sm text-muted-foreground">—</p>
        )}
      </div>

      {/* Battery bar */}
      <div className="flex w-[120px] shrink-0 items-center gap-2">
        {batteryPct !== null && batteryPct !== undefined ? (
          <>
            <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
              <div
                className={cn('h-full rounded-full', getBatteryColour(batteryPct))}
                style={{ width: `${Math.min(Math.max(batteryPct, 0), 100)}%` }}
              />
            </div>
            <span className="font-body text-xs text-muted-foreground">
              {batteryPct}%
            </span>
          </>
        ) : (
          <p className="font-body text-sm text-muted-foreground">—</p>
        )}
      </div>
    </Link>
  );
}
