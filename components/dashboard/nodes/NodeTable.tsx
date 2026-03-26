'use client';

/**
 * NodeTable
 * Renders a filterable-ready table of network nodes. Pure presentational — it
 * receives an already-filtered list and renders an HTML `<table>` with header,
 * body rows, a loading skeleton state, and an empty state.
 *
 * Columns: Name, Type, Status, Last Seen, RSSI, SNR, Battery.
 *
 * Each body row is clickable and navigates to the node detail page via
 * `useRouter().push` (a `<Link>` inside `<tr>` would produce invalid HTML).
 *
 * @prop nodes       — pre-filtered array of Node objects, each augmented with
 *                     its most recent Reading (or null)
 * @prop isLoading   — when true, renders 6 animated skeleton rows
 */

import { type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { Node, Reading } from '@/types';
import { NODE_TYPE_LABELS, NODE_TYPE_SHORT } from '@/lib/constants';
import { cn, formatRelativeTime } from '@/lib/utils';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';

interface NodeTableProps {
  nodes: (Node & { latestReading: Reading | null })[];
  isLoading: boolean;
}

const COLUMN_COUNT = 7;
const SKELETON_ROW_COUNT = 6;

function getBatteryColour(pct: number): string {
  if (pct >= 50) return 'bg-green-500';
  if (pct >= 20) return 'bg-amber-500';
  return 'bg-red-500';
}

export function NodeTable({ nodes, isLoading }: NodeTableProps) {
  const router = useRouter();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-zinc-800">
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            Name
          </th>
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            Type
          </th>
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            Status
          </th>
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            Last Seen
          </th>
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            RSSI
          </th>
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            SNR
          </th>
          <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-zinc-400">
            Battery
          </th>
        </tr>
      </thead>

      <tbody>
        {isLoading && <SkeletonRows />}

        {!isLoading && nodes.length === 0 && (
          <tr>
            <td
              colSpan={COLUMN_COUNT}
              className="px-4 py-12 text-center font-body text-sm text-zinc-500"
            >
              No nodes match your filters
            </td>
          </tr>
        )}

        {!isLoading &&
          nodes.map((node) => (
            <tr
              key={node.id}
              onClick={() => router.push(`/nodes/${node.id}`)}
              className="cursor-pointer border-b border-zinc-800 bg-zinc-900 transition-colors hover:bg-zinc-800"
            >
              {/* Name + type short label */}
              <td className="px-4 py-3">
                <p className="font-heading font-semibold text-zinc-100">
                  {node.name}
                </p>
                <p className="font-body text-xs text-zinc-500">
                  {NODE_TYPE_SHORT[node.type]}
                </p>
              </td>

              {/* Type — full label */}
              <td className="px-4 py-3 font-body text-zinc-300">
                {NODE_TYPE_LABELS[node.type]}
              </td>

              {/* Status badge */}
              <td className="px-4 py-3">
                <NodeStatusBadge status={node.status} />
              </td>

              {/* Last Seen */}
              <td className="px-4 py-3 font-body text-zinc-300">
                {formatRelativeTime(node.lastSeenAt)}
              </td>

              {/* RSSI */}
              <td className="px-4 py-3">
                {node.latestReading?.rssi != null ? (
                  <span className="font-body text-zinc-100">
                    {node.latestReading.rssi}{' '}
                    <span className="text-zinc-500">dBm</span>
                  </span>
                ) : (
                  <span className="font-body text-zinc-500">—</span>
                )}
              </td>

              {/* SNR */}
              <td className="px-4 py-3">
                {node.latestReading?.snr != null ? (
                  <span className="font-body text-zinc-100">
                    {node.latestReading.snr}{' '}
                    <span className="text-zinc-500">dB</span>
                  </span>
                ) : (
                  <span className="font-body text-zinc-500">—</span>
                )}
              </td>

              {/* Battery */}
              <td className="px-4 py-3">
                <BatteryCell pct={node.latestReading?.batteryPct ?? null} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

interface BatteryCellProps {
  pct: number | null;
}

function BatteryCell({ pct }: BatteryCellProps) {
  if (pct === null || pct === undefined) {
    return <span className="font-body text-zinc-500">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-700">
        <div
          className={cn(
            'h-full rounded-full w-[var(--batt-w)]',
            getBatteryColour(pct),
          )}
          style={{ '--batt-w': `${Math.min(Math.max(pct, 0), 100)}%` } as CSSProperties}
        />
      </div>
      <span className="font-body text-xs text-zinc-300">{pct}%</span>
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <tr
          key={`skeleton-${i}`}
          className="border-b border-zinc-800 bg-zinc-900"
        >
          {/* Name */}
          <td className="px-4 py-3">
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-700" />
            <div className="mt-1 h-3 w-10 animate-pulse rounded bg-zinc-700" />
          </td>
          {/* Type */}
          <td className="px-4 py-3">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-700" />
          </td>
          {/* Status */}
          <td className="px-4 py-3">
            <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-700" />
          </td>
          {/* Last Seen */}
          <td className="px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-700" />
          </td>
          {/* RSSI */}
          <td className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-700" />
          </td>
          {/* SNR */}
          <td className="px-4 py-3">
            <div className="h-4 w-14 animate-pulse rounded bg-zinc-700" />
          </td>
          {/* Battery */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-20 animate-pulse rounded-full bg-zinc-700" />
              <div className="h-3 w-8 animate-pulse rounded bg-zinc-700" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
