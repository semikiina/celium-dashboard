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
import { Button } from '@/components/ui/button';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RecentNodeActivityProps {
  nodes: Node[];
  latestReadings: Record<string, Reading>;
}

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
    <Card className="gap-0 rounded-xl border border-border bg-background py-0 shadow-none ring-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-6 pb-0 pt-6">
        <CardTitle className="font-heading text-xl font-bold text-foreground">
          Recent Node Activity
        </CardTitle>
        <Button variant="link" asChild className="h-auto p-0 font-body text-sm text-primary">
          <Link href="/nodes">View all nodes &rarr;</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        <div className="grid grid-cols-3 gap-4">
          {recentNodes.map((node) => {
            const reading = latestReadings[node.id];
            const batteryPct = reading?.batteryPct ?? node.batteryPct;
            const rssi = reading?.rssi ?? null;
            const externalId = `NODE-${String(node.externalId).padStart(3, '0')}`;

            return (
              <Link
                key={node.id}
                href={`/nodes/${node.id}`}
                className="bg-muted rounded-[10px] border border-border/50 p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-body text-base font-medium text-foreground">
                    {node.name}
                  </span>
                  <div className="shrink-0">
                    <NodeStatusBadge status={node.status} />
                  </div>
                </div>
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {externalId}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  {batteryPct !== null && batteryPct !== undefined && (
                    <div className="flex items-center gap-1">
                      <Battery className="size-3 text-muted-foreground" />
                      <span className="font-body text-xs text-muted-foreground">
                        {batteryPct}%
                      </span>
                    </div>
                  )}
                  {rssi !== null && (
                    <div className="flex items-center gap-1">
                      <Signal className="size-3 text-muted-foreground" />
                      <span className="font-body text-xs text-muted-foreground">
                        {rssi} dBm
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
