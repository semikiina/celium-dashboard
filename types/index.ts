/**
 * Shared TypeScript types used across the Celium Dashboard codebase.
 */

export type NodeType = 'gateway' | 'relay' | 'end_node';

export type NodeStatus = 'online' | 'offline' | 'warning' | 'unknown';

export type AlertSeverity = 'info' | 'warning' | 'critical';

/**
 * Represents a single network node in the Celium mesh.
 */
export interface Node {
  id: string;
  externalId: number;
  name: string;
  type: NodeType;
  status: NodeStatus;
  gatewayId: string | null;
  lat: number | null;
  lng: number | null;
  firmwareVer: string | null;
  hardwareVer: string | null;
  deployedAt: string | null;
  lastSeenAt: string | null;
}

/**
 * Represents one telemetry reading transmitted by a node.
 */
export interface Reading {
  id: string;
  nodeId: string;
  timestamp: string;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  rssi: number | null;
  snr: number | null;
  spreadingFactor: number | null;
  batteryVoltage: number | null;
  batteryPct: number | null;
  hopCount: number | null;
  seqNum: number | null;
  rawPayload: Record<string, unknown> | null;
}

/**
 * Represents a system alert raised by node or network conditions.
 */
export interface Alert {
  id: string;
  nodeId: string | null;
  severity: AlertSeverity;
  type: string;
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

/**
 * Represents aggregate network health and count metrics.
 */
export interface NetworkStats {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  warningNodes: number;
  activeAlerts: number;
  gatewayCount: number;
  endNodeCount: number;
}

/**
 * SeedNodeDefinition
 * Defines one deterministic node entry used by the development seed script.
 */
export interface SeedNodeDefinition {
  key: string;
  externalId: number;
  name: string;
  type: NodeType;
  status: NodeStatus;
  parentKey: string | null;
  lat: number;
  lng: number;
  firmwareVer: string;
  hardwareVer: string;
  mobile: boolean;
}

/**
 * InsertedSeedNode
 * Minimal node row shape selected back after insert.
 */
export interface InsertedSeedNode {
  id: string;
  external_id: number;
  name: string;
}

/**
 * SeedAlertDefinition
 * Defines one deterministic alert entry used by the development seed script.
 */
export interface SeedAlertDefinition {
  nodeKey: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  resolved: boolean;
  createdAtOffsetHours: number;
  resolvedAfterHours: number | null;
}
