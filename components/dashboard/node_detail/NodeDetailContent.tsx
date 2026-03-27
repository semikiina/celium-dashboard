'use client';

/**
 * NodeDetailContent
 * Client component that fetches and renders all interactive content for
 * the Node Detail page. Composes NodeDetailHeader, ValueCard strip,
 * NodeInfoCard, and SensorLineChart panels.
 *
 * Layout:
 *   1. Header (back link, name, status, type)
 *   2. Value cards strip (6 metrics: temp, humidity, pressure, battery, RSSI, hops)
 *   3. Two-column layout: Node Info (left) + charts (right)
 *   4. Charts: Temperature, Humidity, Pressure, Battery over time
 *
 * @prop nodeId — the UUID of the node to display
 */

import {
  Thermometer,
  Droplets,
  Gauge,
  Battery,
  Signal,
  Route,
} from 'lucide-react';
import { useNode } from '@/hooks/useNode';
import { useReadings } from '@/hooks/useReadings';
import { CHART_COLOURS } from '@/lib/constants';
import { NodeDetailHeader } from '@/components/dashboard/node_detail/NodeDetailHeader';
import { ValueCard } from '@/components/dashboard/node_detail/ValueCard';
import { NodeInfoCard } from '@/components/dashboard/node_detail/NodeInfoCard';
import { SensorLineChart } from '@/components/dashboard/charts/SensorLineChart';

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
        <div className="h-12 w-72 animate-pulse rounded-lg bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-zinc-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-xl bg-zinc-800" />
          <div className="col-span-2 space-y-6">
            <div className="h-72 animate-pulse rounded-xl bg-zinc-800" />
            <div className="h-72 animate-pulse rounded-xl bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  const r = node.latestReading;

  return (
    <div className="space-y-6 p-8">
      <NodeDetailHeader
        name={node.name}
        status={node.status}
        type={node.type}
      />

      {/* Current value cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <ValueCard
          label="Temperature"
          value={r?.temperature !== null && r?.temperature !== undefined ? `${r.temperature.toFixed(1)}°C` : '—'}
          icon={<Thermometer />}
        />
        <ValueCard
          label="Humidity"
          value={r?.humidity !== null && r?.humidity !== undefined ? `${r.humidity.toFixed(1)}%` : '—'}
          icon={<Droplets />}
        />
        <ValueCard
          label="Pressure"
          value={r?.pressure !== null && r?.pressure !== undefined ? `${r.pressure.toFixed(0)} hPa` : '—'}
          icon={<Gauge />}
        />
        <ValueCard
          label="Battery"
          value={r?.batteryPct !== null && r?.batteryPct !== undefined ? `${r.batteryPct}%` : '—'}
          icon={<Battery />}
        />
        <ValueCard
          label="Signal"
          value={r?.rssi !== null && r?.rssi !== undefined ? `${r.rssi} dBm` : '—'}
          icon={<Signal />}
        />
        <ValueCard
          label="Hop Count"
          value={r?.hopCount !== null && r?.hopCount !== undefined ? `${r.hopCount}` : '—'}
          icon={<Route />}
        />
      </div>

      {/* Info card + charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <NodeInfoCard
          firmwareVer={node.firmwareVer}
          hardwareVer={node.hardwareVer}
          lat={node.lat}
          lng={node.lng}
          deployedAt={node.deployedAt}
          lastSeenAt={node.lastSeenAt}
          externalId={node.externalId}
        />

        <div className="col-span-1 space-y-6 lg:col-span-2">
          {readingsLoading ? (
            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-xl bg-zinc-800" />
              <div className="h-72 animate-pulse rounded-xl bg-zinc-800" />
            </div>
          ) : (
            <>
              <SensorLineChart
                title="Temperature Over Time"
                data={readings}
                dataKey="temperature"
                unit="°C"
                color={CHART_COLOURS.blue}
              />
              <SensorLineChart
                title="Humidity Over Time"
                data={readings}
                dataKey="humidity"
                unit="%"
                color={CHART_COLOURS.cyan}
              />
              <SensorLineChart
                title="Atmospheric Pressure"
                data={readings}
                dataKey="pressure"
                unit=" hPa"
                color={CHART_COLOURS.cyan}
              />
              <SensorLineChart
                title="Battery Level"
                data={readings}
                dataKey="batteryPct"
                unit="%"
                color={CHART_COLOURS.blue}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
