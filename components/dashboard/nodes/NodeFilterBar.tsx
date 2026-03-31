'use client';

/**
 * NodeFilterBar
 * Controlled filter bar for the Nodes page. Renders a search input with label,
 * Status and Type shadcn Selects inside a Card. A summary line ("Showing X of Y nodes")
 * is displayed below the inputs, separated by a Separator.
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

import { Search } from 'lucide-react';
import type { NodeListStatusFilter, NodeListTypeFilter } from '@/types';
import { NODE_TYPE_DISPLAY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface NodeFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: NodeListStatusFilter;
  onStatusFilterChange: (value: NodeListStatusFilter) => void;
  typeFilter: NodeListTypeFilter;
  onTypeFilterChange: (value: NodeListTypeFilter) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS: { label: string; value: NodeListStatusFilter }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Warning', value: 'warning' },
];

const TYPE_OPTIONS: { label: string; value: NodeListTypeFilter }[] = [
  { label: 'All Types', value: 'all' },
  { label: NODE_TYPE_DISPLAY.gateway, value: 'gateway' },
  { label: NODE_TYPE_DISPLAY.relay, value: 'relay' },
  { label: NODE_TYPE_DISPLAY.end_node, value: 'end_node' },
];

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
    <Card className="gap-0 rounded-[14px] border border-border bg-background py-0 shadow-none ring-0">
      <CardContent className="flex flex-col gap-0 p-0">
        <div className="flex gap-4 px-6 pt-6">
          <div className="flex flex-1 flex-col gap-2">
            <Label
              htmlFor="nodes-search"
              className="font-body text-sm font-medium text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nodes-search"
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name or ID..."
                className={cn(
                  'h-auto min-h-0 rounded-[10px] border-border bg-muted py-2.5 pl-10 pr-4 font-body text-sm',
                )}
              />
            </div>
          </div>

          <div className="flex w-[178px] shrink-0 flex-col gap-2">
            <Label
              htmlFor="nodes-status-filter"
              className="font-body text-sm font-medium text-muted-foreground"
            >
              Status
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                onStatusFilterChange(v as NodeListStatusFilter)
              }
            >
              <SelectTrigger
                id="nodes-status-filter"
                className="h-auto w-full min-w-0 rounded-[10px] border-border bg-muted px-4 py-2.5 font-body text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[178px] shrink-0 flex-col gap-2">
            <Label
              htmlFor="nodes-type-filter"
              className="font-body text-sm font-medium text-muted-foreground"
            >
              Type
            </Label>
            <Select
              value={typeFilter}
              onValueChange={(v) =>
                onTypeFilterChange(v as NodeListTypeFilter)
              }
            >
              <SelectTrigger
                id="nodes-type-filter"
                className="h-auto w-full min-w-0 rounded-[10px] border-border bg-muted px-4 py-2.5 font-body text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="mx-6 mt-4 bg-border" />

        <div className="px-6 py-2.5">
          <p className="font-body text-sm text-muted-foreground">
            Showing {filteredCount} of {totalCount} nodes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
