'use client';

/**
 * NodeStatusBadge
 * Renders a colour-coded pill badge indicating the current status of a network node.
 * Uses STATUS_COLOURS from constants to ensure consistent status styling across the app.
 *
 * @prop status — one of 'online' | 'offline' | 'warning' | 'unknown'
 */

import { NodeStatus } from '@/types';
import { STATUS_COLOURS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NodeStatusBadgeProps {
  status: NodeStatus;
}

export function NodeStatusBadge({ status }: NodeStatusBadgeProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-medium',
        STATUS_COLOURS[status],
      )}
    >
      {label}
    </span>
  );
}
