'use client';

/**
 * NodesPage
 * Screen 2 — Node List. Displays all network nodes in a filterable, sortable
 * table. Manages search, status filter, type filter, and sort state locally.
 * Derives the filtered & sorted node list from the useNodes hook on each render.
 * Composes NodeFilterBar (controlled) and NodeTable (presentational).
 */

import { useMemo, useState, useCallback } from 'react';
import { useNodes } from '@/hooks/useNodes';
import { NodeFilterBar } from '@/components/dashboard/nodes/NodeFilterBar';
import {
  NodeTable,
  type SortColumn,
  type SortDir,
} from '@/components/dashboard/nodes/NodeTable';
import { Node, NodeType, Reading } from '@/types';

type StatusFilterValue = 'all' | 'online' | 'offline' | 'warning';
type TypeFilterValue = 'all' | NodeType;

type NodeWithReading = Node & { latestReading: Reading | null };

function compareNodes(
  a: NodeWithReading,
  b: NodeWithReading,
  column: SortColumn,
  dir: SortDir,
): number {
  const mult = dir === 'asc' ? 1 : -1;

  switch (column) {
    case 'name':
      return mult * a.name.localeCompare(b.name);
    case 'status': {
      const order: Record<string, number> = {
        online: 0,
        warning: 1,
        unknown: 2,
        offline: 3,
      };
      return mult * ((order[a.status] ?? 4) - (order[b.status] ?? 4));
    }
    case 'battery': {
      const aPct = a.latestReading?.batteryPct ?? -1;
      const bPct = b.latestReading?.batteryPct ?? -1;
      return mult * (aPct - bPct);
    }
    case 'signal': {
      const aRssi = a.latestReading?.rssi ?? -999;
      const bRssi = b.latestReading?.rssi ?? -999;
      return mult * (aRssi - bRssi);
    }
    case 'lastSeen': {
      const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      return mult * (aTime - bTime);
    }
    default:
      return 0;
  }
}

export default function NodesPage() {
  const { nodes, isLoading } = useNodes();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilterValue>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = useCallback(
    (column: SortColumn) => {
      if (sortColumn === column) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(column);
        setSortDir('asc');
      }
    },
    [sortColumn],
  );

  const filteredNodes = useMemo(() => {
    let result = nodes;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.name.toLowerCase().includes(query) ||
          String(n.externalId).includes(query),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((n) => n.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter((n) => n.type === typeFilter);
    }

    return [...result].sort((a, b) =>
      compareNodes(a, b, sortColumn, sortDir),
    );
  }, [nodes, search, statusFilter, typeFilter, sortColumn, sortDir]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Node List
        </h1>
        <p className="mt-2 font-body text-base text-muted-foreground">
          Manage and monitor all network nodes
        </p>
      </div>

      <NodeFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        totalCount={nodes.length}
        filteredCount={filteredNodes.length}
      />

      <NodeTable
        nodes={filteredNodes}
        isLoading={isLoading}
        sortColumn={sortColumn}
        sortDir={sortDir}
        onSort={handleSort}
      />
    </div>
  );
}
