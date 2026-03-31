'use client';

/**
 * NodeDetailContent
 * Client component that fetches and renders all interactive content for
 * the Node Detail page. Matches Figma Page 5 layout:
 *
 *   1. Back link
 *   2. Header card (name, status badge, external ID, 4 info pills)
 *   3. Three sensor value cards (Temperature, Humidity, Pressure)
 *   4–6. Three chart panels via NodeDetailCharts (shadcn Card + Chart)
 *
 * @prop nodeId — the UUID of the node to display
 */

import Link from 'next/link';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Gauge,
} from 'lucide-react';
import { useNode } from '@/hooks/useNode';
import { useReadings } from '@/hooks/useReadings';
import { NodeDetailHeader } from '@/components/dashboard/node_detail/NodeDetailHeader';
import { NodeDetailCharts } from '@/components/dashboard/node_detail/NodeDetailCharts';
import { ValueCard } from '@/components/dashboard/node_detail/ValueCard';

interface NodeDetailContentProps {
  nodeId: string;
}

export function NodeDetailContent({ nodeId }: NodeDetailContentProps) {
  const { node, isLoading: nodeLoading, error: nodeError } = useNode(nodeId);
  const { readings, isLoading: readingsLoading } = useReadings(nodeId);

  if (nodeError) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="font-body text-sm text-red-400">
          Failed to load node data. The node may not exist.
        </p>
      </div>
    );
  }

  if (nodeLoading || !node) {
    return (
      <div className="space-y-6 p-8">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-800" />
        <div className="h-48 animate-pulse rounded-xl bg-zinc-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[118px] animate-pulse rounded-xl bg-zinc-800"
            />
          ))}
        </div>
        <div className="h-[394px] animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-[394px] animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-[394px] animate-pulse rounded-xl bg-zinc-800" />
      </div>
    );
  }

  const r = node.latestReading;

  return (
    <div className="space-y-6 p-8">
      {/* Back link */}
      <Link
        href="/nodes"
        className="inline-flex items-center gap-1.5 font-body text-sm text-zinc-400 transition-colors hover:text-brand-cyan"
      >
        <ArrowLeft className="size-4" />
        Back to Nodes
      </Link>

      {/* Header card */}
      <NodeDetailHeader
        name={node.name}
        status={node.status}
        type={node.type}
        externalId={node.externalId}
        batteryPct={r?.batteryPct ?? node.batteryPct ?? null}
        rssi={r?.rssi ?? null}
        lat={node.lat}
        lng={node.lng}
        lastSeenAt={node.lastSeenAt}
      />

      {/* Sensor value cards — 3 across */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ValueCard
          label="Temperature"
          value={
            r?.temperature !== null && r?.temperature !== undefined
              ? `${r.temperature.toFixed(1)}°C`
              : '—'
          }
          icon={<Thermometer />}
          iconColorClass="bg-red-500/20 text-red-400"
        />
        <ValueCard
          label="Humidity"
          value={
            r?.humidity !== null && r?.humidity !== undefined
              ? `${r.humidity.toFixed(0)}%`
              : '—'
          }
          icon={<Droplets />}
          iconColorClass="bg-brand-blue/20 text-brand-blue"
        />
        <ValueCard
          label="Pressure"
          value={
            r?.pressure !== null && r?.pressure !== undefined
              ? `${r.pressure.toFixed(1)} hPa`
              : '—'
          }
          icon={<Gauge />}
          iconColorClass="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Charts — full width, stacked (shadcn Card + Chart) */}
      <NodeDetailCharts readings={readings} isLoading={readingsLoading} />
    </div>
  );
}
