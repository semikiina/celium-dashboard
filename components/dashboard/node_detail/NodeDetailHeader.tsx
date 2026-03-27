'use client';

/**
 * NodeDetailHeader
 * Renders the top section of the Node Detail page: a back link to /nodes,
 * the node name, its status badge, and the node type label.
 *
 * @prop name   — human-readable node name (e.g. "Gateway Alpha")
 * @prop status — current node status for the badge
 * @prop type   — node type for the type label
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NodeStatus, NodeType } from '@/types';
import { NODE_TYPE_LABELS } from '@/lib/constants';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';

interface NodeDetailHeaderProps {
  name: string;
  status: NodeStatus;
  type: NodeType;
}

export function NodeDetailHeader({ name, status, type }: NodeDetailHeaderProps) {
  return (
    <div>
      <Link
        href="/nodes"
        className="mb-4 inline-flex items-center gap-1.5 font-body text-sm text-zinc-400 transition-colors hover:text-brand-cyan"
      >
        <ArrowLeft className="size-4" />
        Back to Nodes
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="font-heading text-3xl font-bold text-zinc-100">
          {name}
        </h1>
        <NodeStatusBadge status={status} />
      </div>

      <p className="mt-1 font-body text-sm text-zinc-400">
        {NODE_TYPE_LABELS[type]}
      </p>
    </div>
  );
}
