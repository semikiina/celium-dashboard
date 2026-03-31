/**
 * StatCard
 * Renders a tall metric tile used on the Overview page.
 * Each card has a gradient icon circle at the top, a large value,
 * a label, and a secondary subtitle line. Matches the Figma design
 * with semantic background and subtle border.
 *
 * @prop icon            — React node (lucide-react icon) displayed in the gradient circle
 * @prop iconClassName   — Tailwind classes for the icon circle background (e.g. arbitrary gradient)
 * @prop value           — primary metric displayed large (e.g. "12", "~45,000 km²")
 * @prop label           — metric name below the value (e.g. "Total Nodes")
 * @prop subtitle        — secondary description (e.g. "9 active, 1 offline")
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: ReactNode;
  iconClassName: string;
  value: string | number;
  label: string;
  subtitle: string;
  className?: string;
}

export function StatCard({
  icon,
  iconClassName,
  value,
  label,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'gap-0 rounded-xl border border-border bg-background py-0 shadow-none ring-0',
        className,
      )}
    >
      <CardContent className="p-6">
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-[10px] text-white shadow-lg [&>svg]:size-6',
            iconClassName,
          )}
        >
          {icon}
        </div>

        <p className="mt-4 font-heading text-2xl font-bold text-foreground">
          {value}
        </p>

        <p className="mt-1 font-body text-sm text-muted-foreground">{label}</p>

        <p className="text-primary mt-1 font-body text-xs">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
