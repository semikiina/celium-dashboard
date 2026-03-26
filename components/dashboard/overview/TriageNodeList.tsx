'use client';

/**
 * TriageNodeList
 * Renders a priority-sorted list of network nodes for the Overview page.
 * Offline and at-risk nodes surface to the top via sortNodesByUrgency.
 * Section labels ("Needs Attention" / "Healthy") visually separate urgent
 * nodes from healthy ones.
 *
 * @prop nodes — full array of Node objects to display
 * @prop latestReadings — map of node.id → most recent Reading for that node
 */

import { Node, Reading } from '@/types';
import { sortNodesByUrgency } from '@/lib/sort';
import { NodeRow } from '@/components/dashboard/nodes/NodeRow';

interface TriageNodeListProps {
  nodes: Node[];
  latestReadings: Record<string, Reading>;
}

export function TriageNodeList({ nodes, latestReadings }: TriageNodeListProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-body text-sm text-zinc-500">No nodes found</p>
      </div>
    );
  }

  const sorted = sortNodesByUrgency(nodes);

  const needsAttention =
    sorted[0].status === 'offline' || sorted[0].status === 'warning';

  const firstHealthyIndex = sorted.findIndex(
    (node) => node.status === 'online',
  );

  return (
    <div className="max-h-[calc(100vh-16rem)] w-full overflow-y-auto">
      {sorted.map((node, index) => {
        const showNeedsAttention = needsAttention && index === 0;
        const showHealthy = firstHealthyIndex !== -1 && index === firstHealthyIndex;

        return (
          <div key={node.id}>
            {showNeedsAttention && (
              <p className="px-4 pb-1 pt-3 font-body text-xs font-medium text-amber-400">
                Needs Attention
              </p>
            )}
            {showHealthy && (
              <p className="px-4 pb-1 pt-3 font-body text-xs font-medium text-zinc-400">
                Healthy
              </p>
            )}
            <NodeRow node={node} latestReading={latestReadings[node.id]} />
          </div>
        );
      })}
    </div>
  );
}
