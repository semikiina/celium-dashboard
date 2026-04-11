/**
 * sort.ts
 * Utility for sorting nodes by operational urgency.
 * Used in the triage node list and anywhere nodes need priority ordering.
 */

import { Node } from "@/types"

const LOW_BATTERY_THRESHOLD = 20

/**
 * sortNodesByUrgency
 * Sorts an array of Node objects by operational urgency (highest first).
 *
 * Priority order:
 *   1. offline                          — node is unreachable
 *   2. warning + batteryPct < 20        — warning with critically low battery
 *   3. warning (other)                  — warning for another reason
 *   4. online  + batteryPct < 20        — healthy but battery is low
 *   5. online  (other)                  — fully healthy
 *   6. unknown                          — no data / indeterminate state
 *
 * Within each group, nodes are sorted by lastSeenAt ascending
 * (longest unseen first), with null values sorted before non-null
 * (never-seen nodes are treated as highest urgency within the group).
 *
 * Pure function — returns a new array without mutating the input.
 */
export function sortNodesByUrgency(nodes: Node[]): Node[] {
  return [...nodes].sort((a, b) => {
    const urgencyA = getUrgencyRank(a)
    const urgencyB = getUrgencyRank(b)

    if (urgencyA !== urgencyB) {
      return urgencyA - urgencyB
    }

    return compareLastSeen(a.lastSeenAt, b.lastSeenAt)
  })
}

function isLowBattery(node: Node): boolean {
  return node.batteryPct !== null && node.batteryPct < LOW_BATTERY_THRESHOLD
}

/**
 * Returns a numeric rank for the node's urgency group.
 * Lower number = higher urgency.
 */
function getUrgencyRank(node: Node): number {
  switch (node.status) {
    case "offline":
      return 0
    case "warning":
      return isLowBattery(node) ? 1 : 2
    case "online":
      return isLowBattery(node) ? 3 : 4
    case "unknown":
      return 5
  }
}

/**
 * Compares two ISO-8601 lastSeenAt timestamps ascending (oldest first).
 * Null values sort before non-null (never-seen = most urgent).
 */
function compareLastSeen(a: string | null, b: string | null): number {
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1
  return a.localeCompare(b)
}
