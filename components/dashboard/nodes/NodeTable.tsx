'use client';

/**
 * NodeTable
 * Renders a table of network nodes matching the Figma design for Page 2 — Nodes.
 *
 * Columns: Node (sortable), Type, Status (sortable), Battery (sortable),
 *          Signal (sortable), Last Seen (sortable), Location.
 *
 * Each body row is clickable and navigates to the node detail page.
 *
 * @prop nodes       — pre-filtered array of Node objects with latestReading
 * @prop isLoading   — when true, renders skeleton rows
 * @prop sortColumn  — currently active sort column key
 * @prop sortDir     — current sort direction
 * @prop onSort      — callback when a sortable header is clicked
 */

import { type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { Node, Reading } from '@/types';
import { NODE_TYPE_EMOJI, NODE_TYPE_DISPLAY, NODE_TYPE_SHORT } from '@/lib/constants';
import {
  cn,
  formatAbsoluteDateTime,
  formatCoordinates,
  getSignalColourClass,
} from '@/lib/utils';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';

export type SortColumn = 'name' | 'status' | 'battery' | 'signal' | 'lastSeen';
export type SortDir = 'asc' | 'desc';

interface NodeTableProps {
  nodes: (Node & { latestReading: Reading | null })[];
  isLoading: boolean;
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (column: SortColumn) => void;
}

const COLUMN_COUNT = 7;
const SKELETON_ROW_COUNT = 6;

function getBatteryColour(pct: number): string {
  if (pct >= 50) return 'bg-green-500';
  if (pct >= 20) return 'bg-amber-500';
  return 'bg-red-500';
}

const thBase =
  'px-6 py-5 text-left font-body text-sm font-medium text-muted-foreground';

export function NodeTable({
  nodes,
  isLoading,
  sortColumn,
  sortDir,
  onSort,
}: NodeTableProps) {
  const router = useRouter();

  return (
    <div className="bg-background overflow-hidden rounded-[14px] border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted border-border border-b">
            <SortableHeader
              label="Node"
              column="name"
              sortColumn={sortColumn}
              sortDir={sortDir}
              onSort={onSort}
            />
            <th className={thBase}>Type</th>
            <SortableHeader
              label="Status"
              column="status"
              sortColumn={sortColumn}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeader
              label="Battery"
              column="battery"
              sortColumn={sortColumn}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeader
              label="Signal"
              column="signal"
              sortColumn={sortColumn}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeader
              label="Last Seen"
              column="lastSeen"
              sortColumn={sortColumn}
              sortDir={sortDir}
              onSort={onSort}
            />
            <th className={thBase}>Location</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && <SkeletonRows />}

          {!isLoading && nodes.length === 0 && (
            <tr>
              <td
                colSpan={COLUMN_COUNT}
                className="px-6 py-12 text-center font-body text-sm text-muted-foreground"
              >
                No nodes match your filters
              </td>
            </tr>
          )}

          {!isLoading &&
            nodes.map((node) => {
              const { time, date } = formatAbsoluteDateTime(node.lastSeenAt);
              const rssi = node.latestReading?.rssi ?? null;
              const batteryPct = node.latestReading?.batteryPct ?? null;

              return (
                <tr
                  key={node.id}
                  onClick={() => router.push(`/nodes/${node.id}`)}
                  className="border-border/50 cursor-pointer border-b transition-colors hover:bg-muted/60"
                >
                  {/* Node name + external ID */}
                  <td className="px-6 py-4">
                    <p className="font-heading font-semibold text-foreground">
                      {node.name}
                    </p>
                    <p className="text-primary mt-0.5 font-body text-xs">
                      {NODE_TYPE_SHORT[node.type]}-{String(node.externalId).padStart(3, '0')}
                    </p>
                  </td>

                  {/* Type with emoji */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground">
                      <span>{NODE_TYPE_EMOJI[node.type]}</span>
                      {NODE_TYPE_DISPLAY[node.type]}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4">
                    <NodeStatusBadge status={node.status} />
                  </td>

                  {/* Battery */}
                  <td className="px-6 py-4">
                    <BatteryCell pct={batteryPct} />
                  </td>

                  {/* Signal (RSSI) */}
                  <td className="px-6 py-4">
                    {rssi !== null ? (
                      <span
                        className={cn(
                          'font-body text-sm font-medium',
                          getSignalColourClass(rssi),
                        )}
                      >
                        {rssi} dBm
                      </span>
                    ) : (
                      <span className="font-body text-sm text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Last Seen */}
                  <td className="px-6 py-4">
                    <p className="font-body text-sm text-foreground">{time}</p>
                    {date && (
                      <p className="mt-0.5 font-body text-xs text-muted-foreground">
                        {date}
                      </p>
                    )}
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <span className="font-body text-sm text-muted-foreground">
                      {formatCoordinates(node.lat, node.lng)}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (column: SortColumn) => void;
}

function SortableHeader({
  label,
  column,
  sortColumn,
  sortDir,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortColumn === column;

  return (
    <th className={thBase}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors hover:text-foreground',
          isActive && 'text-foreground',
        )}
      >
        {label}
        <ArrowUpDown
          className={cn(
            'size-3.5',
            isActive ? 'text-primary' : 'text-muted-foreground',
          )}
        />
      </button>
    </th>
  );
}

interface BatteryCellProps {
  pct: number | null;
}

function BatteryCell({ pct }: BatteryCellProps) {
  if (pct === null || pct === undefined) {
    return <span className="font-body text-sm text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full w-[var(--batt-w)]',
            getBatteryColour(pct),
          )}
          style={
            {
              '--batt-w': `${Math.min(Math.max(pct, 0), 100)}%`,
            } as CSSProperties
          }
        />
      </div>
      <span className="font-body text-xs text-muted-foreground">{pct}%</span>
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <tr
          key={`skeleton-${i}`}
          className="border-border/50 border-b"
        >
          <td className="px-6 py-4">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </td>
          <td className="px-6 py-4">
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-8 animate-pulse rounded bg-muted" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </td>
        </tr>
      ))}
    </>
  );
}
