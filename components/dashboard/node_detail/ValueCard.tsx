/**
 * ValueCard
 * Displays a single current metric value inside a compact card.
 * Used on the Node Detail page to show the latest reading for temperature,
 * humidity, pressure, battery, signal strength, etc.
 *
 * @prop label — metric label (e.g. "Temperature")
 * @prop value — formatted display value (e.g. "14.5°C")
 * @prop icon  — React node (lucide-react icon) rendered beside the label
 * @prop className — optional extra Tailwind classes
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ValueCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  className?: string;
}

export function ValueCard({ label, value, icon, className }: ValueCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-700 bg-zinc-900 p-5',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-zinc-400">
        <span className="shrink-0 [&>svg]:size-4">{icon}</span>
        <span className="font-body text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold text-zinc-100">
        {value}
      </p>
    </div>
  );
}
