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

import { type CSSProperties, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Node, Reading } from '@/types';
import {
  NODE_TYPE_EMOJI,
  NODE_TYPE_DISPLAY,
  NODE_TYPE_SHORT,
  getBatteryBarFillClass,
} from '@/lib/constants';
import {
  cn,
  formatAbsoluteDateTime,
  formatCoordinates,
  getSignalColourClass,
} from '@/lib/utils';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const thClass =
  'px-6 py-5 text-left font-body text-sm font-medium text-muted-foreground';

export function NodeTable({
  nodes,
  isLoading,
  sortColumn,
  sortDir,
  onSort,
}: NodeTableProps) {
  const router = useRouter();

  function goToNode(id: string) {
    router.push(`/nodes/${id}`);
  }

  function rowKeyDown(e: KeyboardEvent<HTMLTableRowElement>, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToNode(id);
    }
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-[14px] border border-border bg-background py-0 shadow-none ring-0">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted hover:bg-muted">
            <SortableHeader
              label="Node"
              column="name"
              sortColumn={sortColumn}
              sortDir={sortDir}
              onSort={onSort}
            />
            <TableHead className={thClass}>Type</TableHead>
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
            <TableHead className={thClass}>Location</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && <SkeletonRows />}

          {!isLoading && nodes.length === 0 && (
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableCell
                colSpan={COLUMN_COUNT}
                className="px-6 py-12 text-center font-body text-sm text-muted-foreground"
              >
                No nodes match your filters
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            nodes.map((node) => {
              const { time, date } = formatAbsoluteDateTime(node.lastSeenAt);
              const rssi = node.latestReading?.rssi ?? null;
              const batteryPct = node.latestReading?.batteryPct ?? null;

              return (
                <TableRow
                  key={node.id}
                  tabIndex={0}
                  role="link"
                  aria-label={`Open details for ${node.name}`}
                  onClick={() => goToNode(node.id)}
                  onKeyDown={(e) => rowKeyDown(e, node.id)}
                  className="border-border/50 cursor-pointer border-b hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <TableCell className="px-6 py-4">
                    <p className="font-heading font-semibold text-foreground">
                      {node.name}
                    </p>
                    <p className="text-primary mt-0.5 font-body text-xs">
                      {NODE_TYPE_SHORT[node.type]}-
                      {String(node.externalId).padStart(3, '0')}
                    </p>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground">
                      <span>{NODE_TYPE_EMOJI[node.type]}</span>
                      {NODE_TYPE_DISPLAY[node.type]}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <NodeStatusBadge status={node.status} />
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <BatteryCell pct={batteryPct} />
                  </TableCell>

                  <TableCell className="px-6 py-4">
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
                      <span className="font-body text-sm text-muted-foreground">
                        —
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <p className="font-body text-sm text-foreground">{time}</p>
                    {date && (
                      <p className="mt-0.5 font-body text-xs text-muted-foreground">
                        {date}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="font-body text-sm text-muted-foreground">
                      {formatCoordinates(node.lat, node.lng)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
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
  const SortIcon =
    isActive && sortDir === 'asc'
      ? ArrowUp
      : isActive && sortDir === 'desc'
        ? ArrowDown
        : ArrowUpDown;

  return (
    <TableHead className={thClass}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onSort(column)}
        className={cn(
          'h-auto gap-1.5 p-0 font-body text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground',
          isActive && 'text-foreground',
        )}
      >
        {label}
        <SortIcon
          className={cn(
            'size-3.5',
            isActive ? 'text-primary' : 'text-muted-foreground',
          )}
        />
      </Button>
    </TableHead>
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
            'h-full w-[var(--batt-w)] rounded-full',
            getBatteryBarFillClass(pct),
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
        <TableRow
          key={`skeleton-${i}`}
          className="border-border/50 hover:bg-transparent"
        >
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-1 h-3 w-16" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-16 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-1 h-3 w-16" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
