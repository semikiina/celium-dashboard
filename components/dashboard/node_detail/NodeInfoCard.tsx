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

import type { ReactNode } from 'react';
import {
  Cpu,
  MapPin,
  Calendar,
  Clock,
  Hash,
  Layers,
} from 'lucide-react';
import { formatRelativeTime, formatCoordinates } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 shrink-0 text-muted-foreground [&>svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-body text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <p className="font-body text-sm text-foreground">{value}</p>
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
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-none ring-0">
      <CardHeader className="px-6 pb-0 pt-6">
        <CardTitle className="font-heading text-lg font-semibold text-foreground">
          Node Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col px-6 pb-6 pt-3">
        <InfoRow
          icon={<Hash />}
          label="External ID"
          value={`NODE-${String(externalId).padStart(3, '0')}`}
        />
        <Separator />
        <InfoRow
          icon={<Cpu />}
          label="Firmware"
          value={firmwareVer ?? '—'}
        />
        <Separator />
        <InfoRow
          icon={<Layers />}
          label="Hardware"
          value={hardwareVer ?? '—'}
        />
        <Separator />
        <InfoRow
          icon={<MapPin />}
          label="Location"
          value={formatCoordinates(lat, lng)}
        />
        <Separator />
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
        <Separator />
        <InfoRow
          icon={<Clock />}
          label="Last Seen"
          value={formatRelativeTime(lastSeenAt)}
        />
      </CardContent>
    </Card>
  );
}
