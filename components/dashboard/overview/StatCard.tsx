/**
 * StatCard
 * Renders a tall metric tile used on the Overview page.
 * Each card has a gradient icon circle at the top, a large value,
 * a label, and a secondary subtitle line. Matches the Figma design
 * with brand-navy background and subtle blue border.
 *
 * @prop icon      — React node (lucide-react icon) displayed in the gradient circle
 * @prop gradient  — CSS gradient string for the icon circle background
 * @prop value     — primary metric displayed large (e.g. "12", "~45,000 km²")
 * @prop label     — metric name below the value (e.g. "Total Nodes")
 * @prop subtitle  — secondary description (e.g. "9 active, 1 offline")
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  gradient: string;
  value: string | number;
  label: string;
  subtitle: string;
  className?: string;
}

export function StatCard({
  icon,
  gradient,
  value,
  label,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-brand-blue/20 bg-brand-navy p-6',
        className,
      )}
    >
      <div
        className="flex size-12 items-center justify-center rounded-[10px] text-white shadow-lg [&>svg]:size-6"
        style={{ backgroundImage: gradient }}
      >
        {icon}
      </div>

      <p className="mt-4 font-heading text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 font-body text-sm text-zinc-400">{label}</p>

      <p className="mt-1 font-body text-xs text-brand-cyan">{subtitle}</p>
    </div>
  );
}
