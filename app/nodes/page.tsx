'use client';

/**
 * NodesPage
 * Screen 2 — Node List. Displays all network nodes in a filterable table.
 * Manages search and status-filter state locally and derives the filtered
 * node list from the useNodes hook on each render. Composes NodeFilterBar
 * (controlled) and NodeTable (presentational).
 */

import { useMemo, useState } from 'react';
import { useNodes } from '@/hooks/useNodes';
import { NodeFilterBar } from '@/components/dashboard/nodes/NodeFilterBar';
import { NodeTable } from '@/components/dashboard/nodes/NodeTable';

type StatusFilterValue = 'all' | 'online' | 'offline' | 'low_battery';

const LOW_BATTERY_THRESHOLD = 20;

export default function NodesPage() {
  const { nodes, isLoading } = useNodes();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');

  const filteredNodes = useMemo(() => {
    let result = nodes;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((n) => n.name.toLowerCase().includes(query));
    }

    if (statusFilter === 'online') {
      result = result.filter((n) => n.status === 'online');
    } else if (statusFilter === 'offline') {
      result = result.filter((n) => n.status === 'offline');
    } else if (statusFilter === 'low_battery') {
      result = result.filter(
        (n) =>
          n.latestReading?.batteryPct != null &&
          n.latestReading.batteryPct < LOW_BATTERY_THRESHOLD,
      );
    }

    return result;
  }, [nodes, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-zinc-100">
          Nodes
        </h1>
        <p className="mt-1 font-body text-sm text-zinc-400">
          All network nodes across the ArcLoRaM mesh
        </p>
      </div>

      <NodeFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={nodes.length}
        filteredCount={filteredNodes.length}
      />

      <div className="overflow-hidden rounded-lg border border-zinc-700">
        <NodeTable nodes={filteredNodes} isLoading={isLoading} />
      </div>
    </div>
  );
}
