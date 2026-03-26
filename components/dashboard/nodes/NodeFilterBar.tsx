'use client';

/**
 * NodeFilterBar
 * Controlled filter bar for the Nodes page. Renders a search input with an
 * inline search icon and a row of status filter toggle buttons. All state is
 * managed by the parent; this component is purely presentational.
 *
 * @prop search              — current search string
 * @prop onSearchChange      — callback when the search value changes
 * @prop statusFilter        — active status filter key
 * @prop onStatusFilterChange — callback when a status button is clicked
 * @prop totalCount          — total node count before filtering
 * @prop filteredCount       — node count after filtering
 */

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusFilterValue = 'all' | 'online' | 'offline' | 'low_battery';

interface NodeFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: StatusFilterValue) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_BUTTONS: { label: string; value: StatusFilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Low Battery', value: 'low_battery' },
];

export function NodeFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount,
}: NodeFilterBarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Search input with inline icon */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-64 rounded border border-zinc-700 bg-zinc-800 py-2 pl-9 pr-3 font-body text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-blue focus:outline-none"
          />
        </div>

        {/* Status filter button group */}
        <div className="flex overflow-hidden rounded-md">
          {STATUS_BUTTONS.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => onStatusFilterChange(btn.value)}
              className={cn(
                'px-3 py-2 font-body text-sm font-medium transition-colors',
                statusFilter === btn.value
                  ? 'bg-brand-blue text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700',
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered count */}
      <span className="font-body text-sm text-zinc-400">
        Showing {filteredCount} of {totalCount} nodes
      </span>
    </div>
  );
}
