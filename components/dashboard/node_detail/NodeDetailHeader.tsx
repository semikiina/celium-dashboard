'use client';

/**
 * NodeDetailHeader
 * Renders the hero card at the top of the Node Detail page.
 * Layout (matching Figma Page 5):
 *   - Top row: node-type emoji + node name (heading) + status badge (right-aligned)
 *   - Subtitle: "NODE-XXX" external ID
 *   - Bottom row: 4 info pills — Battery, Signal, Location, Last Seen
 *
 * @prop name        — human-readable node name (e.g. "Beacon Delta")
 * @prop status      — current node status for the badge
 * @prop type        — node type (drives the emoji prefix)
 * @prop externalId  — hardware-assigned node ID displayed as "NODE-XXX"
 * @prop batteryPct  — latest battery reading (nullable)
 * @prop rssi        — latest RSSI reading (nullable)
 * @prop lat         — GPS latitude (nullable)
 * @prop lng         — GPS longitude (nullable)
 * @prop lastSeenAt  — ISO timestamp of last contact (nullable)
 */

import { Battery, Signal, MapPin, Clock } from 'lucide-react';
import { NodeStatus, NodeType } from '@/types';
import {
  NODE_TYPE_EMOJI,
  STATUS_COLOURS,
  STATUS_DISPLAY_LABELS,
} from '@/lib/constants';
import { cn, formatCoordinates, formatAbsoluteDateTime } from '@/lib/utils';

interface NodeDetailHeaderProps {
  name: string;
  status: NodeStatus;
  type: NodeType;
  externalId: number;
  batteryPct: number | null;
  rssi: number | null;
  lat: number | null;
  lng: number | null;
  lastSeenAt: string | null;
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/60 px-4 py-3">
      <span className="shrink-0 text-zinc-400 [&>svg]:size-5">{icon}</span>
      <div className="min-w-0">
        <p className="font-body text-xs text-zinc-500">{label}</p>
        <p className="font-body text-sm font-semibold text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

export function NodeDetailHeader({
  name,
  status,
  type,
  externalId,
  batteryPct,
  rssi,
  lat,
  lng,
  lastSeenAt,
}: NodeDetailHeaderProps) {
  const lastSeen = formatAbsoluteDateTime(lastSeenAt);

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      {/* Name row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{NODE_TYPE_EMOJI[type]}</span>
            <h1 className="font-heading text-2xl font-bold text-zinc-100">
              {name}
            </h1>
          </div>
          <p className="mt-1 font-body text-sm text-zinc-400">
            NODE-{String(externalId).padStart(3, '0')}
          </p>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-md px-3 py-1.5 font-body text-xs font-bold tracking-wider',
            STATUS_COLOURS[status],
          )}
        >
          {STATUS_DISPLAY_LABELS[status]}
        </span>
      </div>

      {/* Info pills */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <InfoPill
          icon={<Battery />}
          label="Battery"
          value={batteryPct !== null && batteryPct !== undefined ? `${batteryPct}%` : '—'}
        />
        <InfoPill
          icon={<Signal />}
          label="Signal"
          value={rssi !== null && rssi !== undefined ? `${rssi} dBm` : '—'}
        />
        <InfoPill
          icon={<MapPin />}
          label="Location"
          value={formatCoordinates(lat, lng)}
        />
        <InfoPill
          icon={<Clock />}
          label="Last Seen"
          value={lastSeen.time}
        />
      </div>
    </div>
  );
}
