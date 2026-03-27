'use client';

/**
 * SensorLineChart
 * Renders a Recharts-based time-series chart for a single sensor metric.
 * Supports two variants:
 *   - "line" (default) — simple line chart
 *   - "area" — area chart with a vertical gradient fill
 *
 * @prop title     — chart heading (e.g. "Temperature Over Time")
 * @prop data      — array of readings, must be sorted by timestamp ascending
 * @prop dataKey   — the Reading field to plot on the Y axis (e.g. "temperature")
 * @prop unit      — unit string appended to tooltip/axis values (e.g. "°C")
 * @prop color     — stroke colour for the line (use CHART_COLOURS from constants)
 * @prop variant   — "line" (default) or "area" for gradient-filled area chart
 * @prop className — optional extra Tailwind classes
 */

import { useId } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Reading } from '@/types';

interface SensorLineChartProps {
  title: string;
  data: Reading[];
  dataKey: keyof Reading;
  unit: string;
  color: string;
  variant?: 'line' | 'area';
  className?: string;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatShortTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

interface TooltipPayloadEntry {
  value: number;
  payload: { timestamp: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  unit: string;
}

function CustomTooltip({ active, payload, unit }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="font-body text-xs text-zinc-400">
        {formatTimestamp(entry.payload.timestamp)}
      </p>
      <p className="font-heading text-sm font-semibold text-zinc-100">
        {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        {unit}
      </p>
    </div>
  );
}

export function SensorLineChart({
  title,
  data,
  dataKey,
  unit,
  color,
  variant = 'line',
  className,
}: SensorLineChartProps) {
  const gradientId = useId();
  const filtered = data.filter((r) => r[dataKey] !== null);

  const sharedAxisProps = {
    stroke: '#52525b' as const,
    tick: { fill: '#71717a', fontSize: 11 },
    tickLine: false as const,
    axisLine: false as const,
  };

  const chartContent = (
    <>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#27272a"
        vertical={false}
      />
      <XAxis
        dataKey="timestamp"
        tickFormatter={formatShortTime}
        {...sharedAxisProps}
      />
      <YAxis
        tickFormatter={(v: number) => `${v}${unit}`}
        width={65}
        {...sharedAxisProps}
      />
      <Tooltip
        content={<CustomTooltip unit={unit} />}
        cursor={{ stroke: '#3f3f46', strokeDasharray: '4 4' }}
      />
    </>
  );

  return (
    <div
      className={`rounded-xl border border-zinc-700 bg-zinc-900 p-6 ${className ?? ''}`}
    >
      <h3 className="mb-4 font-heading text-lg font-semibold text-zinc-100">
        {title}
      </h3>

      {filtered.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="font-body text-sm text-zinc-500">
            No data available for this metric
          </p>
        </div>
      ) : variant === 'area' ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filtered}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            {chartContent}
            <Area
              type="monotone"
              dataKey={dataKey as string}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#18181b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filtered}>
            {chartContent}
            <Line
              type="monotone"
              dataKey={dataKey as string}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#18181b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
