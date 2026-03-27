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
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-6',
        className,
      )}
    >
      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          iconColorClass,
        )}
      >
        <span className="[&>svg]:size-6">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="font-body text-sm text-zinc-400">{label}</p>
        <p className="mt-0.5 font-heading text-xl font-bold text-zinc-100">
          {value}
        </p>
      </div>
    </div>
  );
}
