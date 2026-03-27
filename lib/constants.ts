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

export const NODE_TYPE_EMOJI: Record<NodeType, string> = {
  gateway: '🛰️',
  relay: '🔄',
  end_node: '📡',
};

export const NODE_TYPE_DISPLAY: Record<NodeType, string> = {
  gateway: 'Gateway',
  relay: 'Relay',
  end_node: 'End Node',
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

/**
 * Brand colour hex values — use the Tailwind token classes (e.g. `bg-brand-dark`)
 * instead of referencing these directly. Listed here for documentation only.
 *
 * | Token         | Hex       | Usage                                     |
 * |---------------|-----------|-------------------------------------------|
 * | brand-blue    | #1784E3   | Primary actions, active states             |
 * | brand-navy    | #121D2A   | Page / card background                     |
 * | brand-cyan    | #5DD4D8   | Accent, secondary highlights               |
 * | brand-deep    | #1E3A8A   | Hover / pressed depth                      |
 * | brand-dark    | #0A0F14   | Inset surfaces (inputs, table headers)     |
 */

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

/**
 * Tailwind classes for the critical-alert banner on the Overview page.
 * Separated from ALERT_SEVERITY_COLOURS because the banner has multiple
 * styled regions (container, icon, text, link) rather than a single badge.
 */
export const CRITICAL_BANNER_STYLES = {
  container: 'bg-red-900/80 backdrop-blur-sm',
  icon: 'text-red-400',
  text: 'text-red-100',
  link: 'text-red-300 hover:text-red-100',
} as const;

/**
 * Hex values for Recharts chart lines. Recharts requires raw hex strings
 * rather than Tailwind classes. The first two map directly to brand tokens;
 * the remaining two are complementary palette colours chosen for legibility
 * on the dark background.
 */
export const CHART_COLOURS = {
  blue: '#1784E3',
  cyan: '#5DD4D8',
  deep: '#1E3A8A',
  amber: '#F59E0B',
  purple: '#8B5CF6',
} as const;

/**
 * Maps NodeStatus to an uppercase display label used in the Node Detail header badge.
 * Matches the Figma design where "online" is displayed as "ACTIVE".
 */
export const STATUS_DISPLAY_LABELS: Record<NodeStatus, string> = {
  online: 'ACTIVE',
  offline: 'OFFLINE',
  warning: 'WARNING',
  unknown: 'UNKNOWN',
};

export const ALERT_TYPE_VALUES = {
  nodeOffline: 'node_offline',
  signalLost: 'signal_lost',
  lowBattery: 'low_battery',
  firmwareUpdateAvailable: 'firmware_update_available',
  nodeReassociated: 'node_reassociated',
} as const;
