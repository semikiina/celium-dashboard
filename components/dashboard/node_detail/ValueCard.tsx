/**
 * ValueCard
 * Displays a single current sensor metric inside a card with a coloured
 * icon circle. Used on the Node Detail page for Temperature, Humidity,
 * and Pressure readings. Layout matches Figma Page 5 — a 48px coloured
 * icon container on the left, metric label + bold value on the right.
 *
 * @prop label          — metric label (e.g. "Temperature")
 * @prop value          — formatted display value (e.g. "-12.9°C")
 * @prop icon           — React node (lucide-react icon) rendered inside the colour circle
 * @prop iconColorClass — Tailwind bg + text classes for the icon circle (e.g. "bg-red-500/20 text-red-400")
 * @prop className      — optional extra Tailwind classes
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ValueCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconColorClass: string;
  className?: string;
}

export function ValueCard({
  label,
  value,
  icon,
  iconColorClass,
  className,
}: ValueCardProps) {
  return (
    <Card
      className={cn(
        'gap-0 rounded-xl border border-border bg-card py-0 shadow-none ring-0',
        className,
      )}
    >
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl',
            iconColorClass,
          )}
        >
          <span className="[&>svg]:size-6">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="font-body text-sm text-muted-foreground">{label}</p>
          <p className="mt-0.5 font-heading text-xl font-bold text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
