'use client';

/**
 * NodeFilterBar
 * Controlled filter bar for the Nodes page. Renders a search input with label,
 * a Status dropdown, and a Type dropdown inside a card-styled container.
 * A summary line ("Showing X of Y nodes") is displayed below the inputs,
 * separated by a thin blue-tinted border.
 *
 * All state is managed by the parent; this component is purely presentational.
 *
 * @prop search              — current search string
 * @prop onSearchChange      — callback when the search value changes
 * @prop statusFilter        — active status filter key
 * @prop onStatusFilterChange — callback when the status dropdown changes
 * @prop typeFilter          — active type filter key
 * @prop onTypeFilterChange  — callback when the type dropdown changes
 * @prop totalCount          — total node count before filtering
 * @prop filteredCount       — node count after filtering
 */

import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusFilterValue = 'all' | 'online' | 'offline' | 'warning';
type TypeFilterValue = 'all' | 'gateway' | 'relay' | 'end_node';

interface NodeFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: StatusFilterValue) => void;
  typeFilter: TypeFilterValue;
  onTypeFilterChange: (value: TypeFilterValue) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS: { label: string; value: StatusFilterValue }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Warning', value: 'warning' },
];

const TYPE_OPTIONS: { label: string; value: TypeFilterValue }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Gateway', value: 'gateway' },
  { label: 'Repeater', value: 'relay' },
  { label: 'End Node', value: 'end_node' },
];

const selectClass = cn(
  'w-full appearance-none rounded-[10px] border border-brand-blue/20 bg-brand-dark',
  'py-2.5 pl-4 pr-10 font-body text-sm text-zinc-100',
  'focus:border-brand-blue focus:outline-none',
);

export function NodeFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  totalCount,
  filteredCount,
}: NodeFilterBarProps) {
  return (
    <div className="rounded-[14px] border border-brand-blue/20 bg-brand-navy">
      <div className="flex gap-4 px-6 pt-6">
        {/* Search */}
        <div className="flex flex-1 flex-col gap-2">
          <label className="font-body text-sm font-medium text-zinc-400">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or ID..."
              className={cn(
                'w-full rounded-[10px] border border-brand-blue/20 bg-brand-dark',
                'py-2.5 pl-10 pr-4 font-body text-sm text-zinc-100 placeholder:text-zinc-500',
                'focus:border-brand-blue focus:outline-none',
              )}
            />
          </div>
        </div>

        {/* Status dropdown */}
        <div className="flex w-[178px] shrink-0 flex-col gap-2">
          <label className="font-body text-sm font-medium text-zinc-400">
            Status
          </label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as StatusFilterValue)
              }
              className={selectClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* Type dropdown */}
        <div className="flex w-[178px] shrink-0 flex-col gap-2">
          <label className="font-body text-sm font-medium text-zinc-400">
            Type
          </label>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) =>
                onTypeFilterChange(e.target.value as TypeFilterValue)
              }
              className={selectClass}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Summary line */}
      <div className="mx-6 mt-4 border-t border-brand-blue/20 py-2.5">
        <p className="font-body text-sm text-zinc-400">
          Showing {filteredCount} of {totalCount} nodes
        </p>
      </div>
    </div>
  );
}
