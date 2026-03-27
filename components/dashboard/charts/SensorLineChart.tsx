'use client';

/**
 * SensorLineChart
 * Renders a Recharts-based time-series line chart for a single sensor metric.
 * Generic and reusable across any page that needs to plot Reading data over time.
 *
 * @prop title    — chart heading (e.g. "Temperature Over Time")
 * @prop data     — array of readings, must be sorted by timestamp ascending
 * @prop dataKey  — the Reading field to plot on the Y axis (e.g. "temperature")
 * @prop unit     — unit string appended to tooltip/axis values (e.g. "°C")
 * @prop color    — stroke colour for the line (use CHART_COLOURS from constants)
 * @prop className — optional extra Tailwind classes
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  className,
}: SensorLineChartProps) {
  const filtered = data.filter((r) => r[dataKey] !== null);

  return (
    <div
      className={`rounded-xl border border-zinc-700 bg-zinc-900 p-6 ${className ?? ''}`}
    >
      <h3 className="mb-4 font-heading text-lg font-semibold text-zinc-100">
        {title}
      </h3>

      {filtered.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center">
          <p className="font-body text-sm text-zinc-500">
            No data available for this metric
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={filtered}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatShortTime}
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}${unit}`}
              width={60}
            />
            <Tooltip
              content={<CustomTooltip unit={unit} />}
              cursor={{ stroke: '#3f3f46', strokeDasharray: '4 4' }}
            />
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
