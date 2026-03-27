/**
 * NodeInfoCard
 * Displays a card with key metadata about a node: firmware version,
 * hardware version, coordinates, deployment date, and last seen time.
 *
 * @prop firmwareVer — firmware version string
 * @prop hardwareVer — hardware version string
 * @prop lat         — GPS latitude
 * @prop lng         — GPS longitude
 * @prop deployedAt  — ISO timestamp of deployment
 * @prop lastSeenAt  — ISO timestamp of last contact
 * @prop externalId  — hardware-assigned node ID
 */

import {
  Cpu,
  MapPin,
  Calendar,
  Clock,
  Hash,
  Layers,
} from 'lucide-react';
import { formatRelativeTime, formatCoordinates } from '@/lib/utils';

interface NodeInfoCardProps {
  firmwareVer: string | null;
  hardwareVer: string | null;
  lat: number | null;
  lng: number | null;
  deployedAt: string | null;
  lastSeenAt: string | null;
  externalId: number;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 shrink-0 text-zinc-500 [&>svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-body text-xs font-medium text-zinc-500">{label}</p>
        <p className="font-body text-sm text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

export function NodeInfoCard({
  firmwareVer,
  hardwareVer,
  lat,
  lng,
  deployedAt,
  lastSeenAt,
  externalId,
}: NodeInfoCardProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <h2 className="font-heading text-lg font-semibold text-zinc-100">
        Node Information
      </h2>

      <div className="mt-3 divide-y divide-zinc-800">
        <InfoRow
          icon={<Hash />}
          label="External ID"
          value={`NODE-${String(externalId).padStart(3, '0')}`}
        />
        <InfoRow
          icon={<Cpu />}
          label="Firmware"
          value={firmwareVer ?? '—'}
        />
        <InfoRow
          icon={<Layers />}
          label="Hardware"
          value={hardwareVer ?? '—'}
        />
        <InfoRow
          icon={<MapPin />}
          label="Location"
          value={formatCoordinates(lat, lng)}
        />
        <InfoRow
          icon={<Calendar />}
          label="Deployed"
          value={
            deployedAt
              ? new Date(deployedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'
          }
        />
        <InfoRow
          icon={<Clock />}
          label="Last Seen"
          value={formatRelativeTime(lastSeenAt)}
        />
      </div>
    </div>
  );
}
