'use client';

/**
 * NodeDetailCharts
 * Renders the three time-series panels for the Node Detail page (Figma Page 5):
 * Temperature & Humidity, Atmospheric Pressure, Battery & Signal. Uses shadcn
 * Card for chrome and ChartContainer / ChartTooltip / ChartLegend from @/components/ui/chart
 * with Recharts primitives. Series colours use {@link CHART_COLOURS} (Recharts requires hex).
 *
 * @prop readings — time-series rows from useReadings, sorted ascending by timestamp
 * @prop isLoading — when true, shows Skeleton placeholders matching chart card height
 */

import { useId, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_COLOURS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Reading } from '@/types';

interface NodeDetailChartsProps {
  readings: Reading[];
  isLoading: boolean;
}

const CHART_AREA_CLASS = 'h-[300px] w-full aspect-auto';

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

interface ChartPanelProps {
  title: string;
  emptyMessage: string;
  isEmpty: boolean;
  children: ReactNode;
}

function ChartPanel({ title, emptyMessage, isEmpty, children }: ChartPanelProps) {
  return (
    <Card className="rounded-xl border-border bg-card">
      <CardHeader className="border-0 pb-0">
        <CardTitle className="font-heading text-lg font-semibold text-card-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="font-body text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function PressureChart({ data }: { data: Reading[] }) {
  const gradientId = useId();
  const filtered = data.filter((r) => r.pressure !== null);
  const chartConfig = {
    pressure: {
      label: 'Pressure',
      color: CHART_COLOURS.purple,
    },
  } satisfies ChartConfig;

  return (
    <ChartPanel
      title="Atmospheric Pressure"
      emptyMessage="No data available for this metric"
      isEmpty={filtered.length === 0}
    >
      <ChartContainer config={chartConfig} className={CHART_AREA_CLASS}>
        <AreaChart accessibilityLayer data={filtered}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-pressure)"
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor="var(--color-pressure)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatShortTime}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={65}
            tickFormatter={(v: number) => `${v} hPa`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as Reading | undefined;
                  return row?.timestamp ? formatTimestamp(row.timestamp) : '';
                }}
                formatter={(value) => (
                  <div className="flex w-full flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">Pressure</span>
                    <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                      {typeof value === 'number' ? `${value.toFixed(1)} hPa` : String(value)}
                    </span>
                  </div>
                )}
              />
            }
            cursor={false}
          />
          <Area
            dataKey="pressure"
            name="Pressure"
            type="monotone"
            fill={`url(#${gradientId})`}
            stroke="var(--color-pressure)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: 'var(--color-pressure)',
              stroke: 'var(--card)',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartPanel>
  );
}

interface DualMetricChartProps {
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
}

function DualMetricChart({
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
}: DualMetricChartProps) {
  const hasData = data.some(
    (r) => r[leftKey] !== null || r[rightKey] !== null,
  );

  const leftKeyStr = String(leftKey);
  const rightKeyStr = String(rightKey);

  const chartConfig = {
    [leftKeyStr]: { label: leftLabel, color: leftColor },
    [rightKeyStr]: { label: rightLabel, color: rightColor },
  } satisfies ChartConfig;

  return (
    <ChartPanel
      title={title}
      emptyMessage="No data available for this chart"
      isEmpty={!hasData}
    >
      <ChartContainer config={chartConfig} className={CHART_AREA_CLASS}>
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatShortTime}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={65}
            tickFormatter={(v: number) => `${v}${leftUnit}`}
            label={{
              value: leftLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              className: 'fill-muted-foreground text-[11px]',
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={65}
            tickFormatter={(v: number) => `${v}${rightUnit}`}
            label={{
              value: rightLabel,
              angle: 90,
              position: 'insideRight',
              offset: 10,
              className: 'fill-muted-foreground text-[11px]',
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as Reading | undefined;
                  return row?.timestamp ? formatTimestamp(row.timestamp) : '';
                }}
                formatter={(value, _name, item) => {
                  const key = String(item.dataKey ?? '');
                  const unit = key === leftKeyStr ? leftUnit : rightUnit;
                  return (
                    <div className="flex w-full flex-wrap items-center gap-2">
                      <span className="text-muted-foreground">
                        {key === leftKeyStr ? leftLabel : rightLabel}
                      </span>
                      <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                        {typeof value === 'number'
                          ? `${value.toFixed(1)}${unit}`
                          : String(value)}
                      </span>
                    </div>
                  );
                }}
              />
            }
            cursor={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={leftKeyStr}
            name={leftLabel}
            stroke={`var(--color-${leftKeyStr})`}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: `var(--color-${leftKeyStr})`,
              stroke: 'var(--card)',
              strokeWidth: 2,
            }}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={rightKeyStr}
            name={rightLabel}
            stroke={`var(--color-${rightKeyStr})`}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: `var(--color-${rightKeyStr})`,
              stroke: 'var(--card)',
              strokeWidth: 2,
            }}
            connectNulls
          />
        </LineChart>
      </ChartContainer>
    </ChartPanel>
  );
}

/**
 * Renders chart placeholders aligned with loaded chart card height.
 */
export function NodeDetailCharts({ readings, isLoading }: NodeDetailChartsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[394px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6')}>
      <DualMetricChart
        title="Temperature & Humidity"
        data={readings}
        leftKey="temperature"
        rightKey="humidity"
        leftLabel="Temperature (°C)"
        rightLabel="Humidity (%)"
        leftUnit="°C"
        rightUnit="%"
        leftColor={CHART_COLOURS.cyan}
        rightColor={CHART_COLOURS.blue}
      />
      <PressureChart data={readings} />
      <DualMetricChart
        title="Battery & Signal Strength"
        data={readings}
        leftKey="batteryPct"
        rightKey="rssi"
        leftLabel="Battery (%)"
        rightLabel="Signal (dBm)"
        leftUnit="%"
        rightUnit=" dBm"
        leftColor={CHART_COLOURS.amber}
        rightColor={CHART_COLOURS.cyan}
      />
    </div>
  );
}
