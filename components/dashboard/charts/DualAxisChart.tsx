'use client';

/**
 * DualAxisChart
 * Renders a Recharts dual-axis line chart with two Y axes and a bottom legend.
 * Used on the Node Detail page for "Temperature & Humidity" and
 * "Battery & Signal Strength" panels.
 *
 * @prop title      — chart heading
 * @prop data       — array of readings sorted by timestamp ascending
 * @prop leftKey    — Reading field plotted against the left Y axis
 * @prop rightKey   — Reading field plotted against the right Y axis
 * @prop leftLabel  — legend / axis label for the left series (e.g. "Temperature (°C)")
 * @prop rightLabel — legend / axis label for the right series (e.g. "Humidity (%)")
 * @prop leftUnit   — unit string for left axis tick labels
 * @prop rightUnit  — unit string for right axis tick labels
 * @prop leftColor  — hex colour for the left line
 * @prop rightColor — hex colour for the right line
 * @prop className  — optional extra Tailwind classes
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Reading } from '@/types';

interface DualAxisChartProps {
  title: string;
  data: Reading[];
  leftKey: keyof Reading;
  rightKey: keyof Reading;
  leftLabel: string;
  rightLabel: string;
  leftUnit: string;
  rightUnit: string;
  leftColor: string;
  rightColor: string;
  className?: string;
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

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  payload: { timestamp: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  leftUnit: string;
  rightUnit: string;
  leftKey: string;
}

function DualTooltip({
  active,
  payload,
  leftUnit,
  rightUnit,
  leftKey,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="mb-1 font-body text-xs text-zinc-400">
        {formatTimestamp(payload[0].payload.timestamp)}
      </p>
      {payload.map((entry) => {
        const unit = entry.name === leftKey ? leftUnit : rightUnit;
        return (
          <p
            key={entry.name}
            className="font-body text-sm text-zinc-100"
          >
            <span
              className="mr-1.5 inline-block size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            {unit}
          </p>
        );
      })}
    </div>
  );
}

export function DualAxisChart({
  title,
  data,
  leftKey,
  rightKey,
  leftLabel,
  rightLabel,
  leftUnit,
  rightUnit,
  leftColor,
  rightColor,
  className,
}: DualAxisChartProps) {
  const hasData = data.some(
    (r) => r[leftKey] !== null || r[rightKey] !== null,
  );

  return (
    <div
      className={`rounded-xl border border-zinc-700 bg-zinc-900 p-6 ${className ?? ''}`}
    >
      <h3 className="mb-4 font-heading text-lg font-semibold text-zinc-100">
        {title}
      </h3>

      {!hasData ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="font-body text-sm text-zinc-500">
            No data available for this chart
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
              yAxisId="left"
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}${leftUnit}`}
              width={65}
              label={{
                value: leftLabel,
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#71717a', fontSize: 11 },
                offset: -5,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}${rightUnit}`}
              width={65}
              label={{
                value: rightLabel,
                angle: 90,
                position: 'insideRight',
                style: { fill: '#71717a', fontSize: 11 },
                offset: -5,
              }}
            />
            <Tooltip
              content={
                <DualTooltip
                  leftUnit={leftUnit}
                  rightUnit={rightUnit}
                  leftKey={leftKey as string}
                />
              }
              cursor={{ stroke: '#3f3f46', strokeDasharray: '4 4' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#a1a1aa', paddingTop: 8 }}
              iconType="circle"
              iconSize={10}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={leftKey as string}
              name={leftLabel}
              stroke={leftColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: leftColor, stroke: '#18181b', strokeWidth: 2 }}
              connectNulls
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={rightKey as string}
              name={rightLabel}
              stroke={rightColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: rightColor, stroke: '#18181b', strokeWidth: 2 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
