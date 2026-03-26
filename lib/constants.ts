/**
 * Centralized static constants and UI mapping tables for the dashboard.
 */

import { AlertSeverity, NodeStatus, NodeType } from '@/types';

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  gateway: 'C3 — Gateway',
  relay: 'C2 — Relay',
  end_node: 'C1 — End Node',
};

export const NODE_TYPE_SHORT: Record<NodeType, string> = {
  gateway: 'C3',
  relay: 'C2',
  end_node: 'C1',
};

export const STATUS_COLOURS: Record<NodeStatus, string> = {
  online: 'bg-green-500/15 text-green-400 border border-green-500/40',
  offline: 'bg-red-500/15 text-red-400 border border-red-500/40',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/40',
  unknown: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/40',
};

export const ALERT_SEVERITY_COLOURS: Record<AlertSeverity, string> = {
  info: 'bg-brand-blue/15 text-brand-blue border border-brand-blue/40',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/40',
  critical: 'bg-red-500/15 text-red-400 border border-red-500/40',
};

export const REFRESH_INTERVAL = 30000;

export const NODE_TYPE_VALUES = {
  gateway: 'gateway',
  relay: 'relay',
  endNode: 'end_node',
} as const;

export const NODE_STATUS_VALUES = {
  online: 'online',
  offline: 'offline',
  warning: 'warning',
  unknown: 'unknown',
} as const;

export const ALERT_SEVERITY_VALUES = {
  info: 'info',
  warning: 'warning',
  critical: 'critical',
} as const;

export const ALERT_TYPE_VALUES = {
  nodeOffline: 'node_offline',
  signalLost: 'signal_lost',
  lowBattery: 'low_battery',
  firmwareUpdateAvailable: 'firmware_update_available',
  nodeReassociated: 'node_reassociated',
} as const;
