/**
 * Centralized static constants and UI mapping tables for the dashboard.
 */

import { AlertSeverity, NodeStatus, NodeType } from "@/types"

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  gateway: "C3 — Gateway",
  relay: "C2 — Relay",
  end_node: "C1 — End Node",
}

export const NODE_TYPE_SHORT: Record<NodeType, string> = {
  gateway: "C3",
  relay: "C2",
  end_node: "C1",
}

export const NODE_TYPE_EMOJI: Record<NodeType, string> = {
  gateway: "🛰️",
  relay: "🔄",
  end_node: "📡",
}

export const NODE_TYPE_DISPLAY: Record<NodeType, string> = {
  gateway: "Gateway",
  relay: "Relay",
  end_node: "End Node",
}

export const STATUS_COLOURS: Record<NodeStatus, string> = {
  online: "bg-green-500/15 text-green-400 border border-green-500/40",
  offline: "bg-red-500/15 text-red-400 border border-red-500/40",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/40",
  unknown: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/40",
}

export const ALERT_SEVERITY_COLOURS: Record<AlertSeverity, string> = {
  info: "border border-primary/40 bg-primary/15 text-primary",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/40",
  critical: "bg-red-500/15 text-red-400 border border-red-500/40",
}

/** Default SWR polling for alerts, network stats, and other non-telemetry aggregates. */
export const REFRESH_INTERVAL = 30000

/**
 * SWR polling for responses that include latest readings or time-series used for live charts
 * (node list, node detail, readings API). Matches the local simulator default cadence.
 */
export const READINGS_REFRESH_INTERVAL = 5000

export const NODE_TYPE_VALUES = {
  gateway: "gateway",
  relay: "relay",
  endNode: "end_node",
} as const

export const NODE_STATUS_VALUES = {
  online: "online",
  offline: "offline",
  warning: "warning",
  unknown: "unknown",
} as const

export const ALERT_SEVERITY_VALUES = {
  info: "info",
  warning: "warning",
  critical: "critical",
} as const

/**
 * Tailwind classes for the critical-alert banner on the Overview page
 * (shadcn Alert + Figma gradient treatment). Use with {@link AlertBanner}.
 */
export const CRITICAL_BANNER_STYLES = {
  alert:
    "rounded-xl border border-red-500/50 bg-gradient-to-r from-red-500/20 to-red-600/20 px-5 py-4 shadow-none ring-0 [&>svg]:size-6 [&>svg]:text-red-400",
  title: "font-body text-base font-medium text-foreground",
  link: "font-body text-sm text-destructive underline transition-colors hover:text-destructive/80",
} as const

/**
 * Tailwind `bg-*` classes for table/triage battery level bars (fill segment).
 */
export const BATTERY_BAR_FILL_COLOURS = {
  good: "bg-green-500",
  medium: "bg-amber-500",
  critical: "bg-red-500",
} as const

/**
 * Returns the battery bar fill class for a percentage (0–100).
 */
export function getBatteryBarFillClass(pct: number): string {
  if (pct >= 50) return BATTERY_BAR_FILL_COLOURS.good
  if (pct >= 20) return BATTERY_BAR_FILL_COLOURS.medium
  return BATTERY_BAR_FILL_COLOURS.critical
}

/**
 * Stat-card icon tile backgrounds (Tailwind arbitrary gradients).
 * Cyan/blue hex values match {@link CHART_COLOURS}; green/red are overview-only accents.
 */
export const STAT_CARD_ICON_GRADIENT_CLASSES = {
  cyanBlue: "bg-[linear-gradient(135deg,#5DD4D8,#1784E3)]",
  green: "bg-[linear-gradient(135deg,#00BC7D,#009966)]",
  red: "bg-[linear-gradient(135deg,#FB2C36,#E7000B)]",
  blueFade: "bg-[linear-gradient(135deg,#1784E3,rgba(23,132,227,0.7))]",
} as const

/**
 * Horizontal brand gradient for network-health (and similar) progress fills.
 * Hex values match {@link CHART_COLOURS} blue → cyan.
 */
export const NETWORK_HEALTH_BAR_FILL_CLASS =
  "bg-[linear-gradient(90deg,#1784E3,#5DD4D8)]" as const

/**
 * Hex values for Recharts chart lines. Recharts requires raw hex strings
 * rather than Tailwind classes. The first two map directly to brand tokens;
 * the remaining two are complementary palette colours chosen for legibility
 * on the dark background.
 */
export const CHART_COLOURS = {
  blue: "#1784E3",
  cyan: "#5DD4D8",
  deep: "#1E3A8A",
  amber: "#F59E0B",
  purple: "#8B5CF6",
} as const

/**
 * Maps NodeStatus to an uppercase display label used in the Node Detail header badge.
 * Matches the Figma design where "online" is displayed as "ACTIVE".
 */
export const STATUS_DISPLAY_LABELS: Record<NodeStatus, string> = {
  online: "ACTIVE",
  offline: "OFFLINE",
  warning: "WARNING",
  unknown: "UNKNOWN",
}

export const ALERT_TYPE_VALUES = {
  nodeOffline: "node_offline",
  signalLost: "signal_lost",
  lowBattery: "low_battery",
  firmwareUpdateAvailable: "firmware_update_available",
  nodeReassociated: "node_reassociated",
} as const
