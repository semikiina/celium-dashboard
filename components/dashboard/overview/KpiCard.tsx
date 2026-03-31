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
import { Card, CardContent } from '@/components/ui/card';

interface KpiCardProps {
  label: string;
  value: number | string;
  state?: 'green' | 'amber' | 'red' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

const STATE_STYLES: Record<
  NonNullable<KpiCardProps['state']>,
  { value: string; border: string }
> = {
  green: {
    value: 'text-emerald-400',
    border: 'border-l-4 border-l-emerald-400',
  },
  amber: {
    value: 'text-amber-400',
    border: 'border-l-4 border-l-amber-400',
  },
  red: { value: 'text-red-400', border: 'border-l-4 border-l-red-400' },
  neutral: { value: 'text-foreground', border: '' },
};

export function KpiCard({
  label,
  value,
  state = 'neutral',
  icon,
  className,
}: KpiCardProps) {
  const styles = STATE_STYLES[state];

  return (
    <Card
      className={cn(
        'gap-0 rounded-lg border border-border py-0 shadow-none ring-0',
        styles.border,
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="shrink-0 text-muted-foreground [&>svg]:size-4">
              {icon}
            </span>
          )}
          <span className="font-body text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>

        <p className={cn('mt-1 font-heading text-3xl font-bold', styles.value)}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
