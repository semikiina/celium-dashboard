/**
 * KpiCard
 * A generic, reusable KPI tile used in the overview KPI strip.
 * Renders a single metric with an optional colour-coded state accent and icon.
 *
 * @prop label  — metric name displayed above the value (e.g. "Nodes Online")
 * @prop value  — the large primary number or value
 * @prop state  — optional colour state: 'green' | 'amber' | 'red' | 'neutral' (default 'neutral')
 * @prop icon   — optional React node (lucide-react icon) rendered beside the label
 * @prop className — optional extra Tailwind classes for layout overrides
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const STATE_STYLES: Record<
  NonNullable<KpiCardProps['state']>,
  { value: string; border: string }
> = {
  green: { value: 'text-emerald-400', border: 'border-l-4 border-l-emerald-400' },
  amber: { value: 'text-amber-400', border: 'border-l-4 border-l-amber-400' },
  red: { value: 'text-red-400', border: 'border-l-4 border-l-red-400' },
  neutral: { value: 'text-zinc-100', border: '' },
};

interface KpiCardProps {
  label: string;
  value: number | string;
  state?: 'green' | 'amber' | 'red' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({
  label,
  value,
  state = 'neutral',
  icon,
  className,
}: KpiCardProps) {
  const styles = STATE_STYLES[state];

  return (
    <div
      className={cn(
        'rounded-lg border border-zinc-700 bg-zinc-900 p-4',
        styles.border,
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="shrink-0 text-zinc-400 [&>svg]:size-4">{icon}</span>}
        <span className="font-body text-sm font-medium text-zinc-400">{label}</span>
      </div>

      <p className={cn('mt-1 font-heading text-3xl font-bold', styles.value)}>
        {value}
      </p>
    </div>
  );
}
