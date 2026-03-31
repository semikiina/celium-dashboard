'use client';

/**
 * NodeStatusBadge
 * Renders a colour-coded pill badge indicating the current status of a network node.
 * Composes shadcn Badge with STATUS_COLOURS from constants for consistent styling.
 *
 * @prop status — one of 'online' | 'offline' | 'warning' | 'unknown'
 */

import { NodeStatus } from '@/types';
import { STATUS_COLOURS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NodeStatusBadgeProps {
  status: NodeStatus;
}

export function NodeStatusBadge({ status }: NodeStatusBadgeProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-auto rounded-full border px-2.5 py-0.5 font-body text-xs font-medium shadow-none',
        STATUS_COLOURS[status],
      )}
    >
      {label}
    </Badge>
  );
}
