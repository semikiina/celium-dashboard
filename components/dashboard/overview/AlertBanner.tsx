/**
 * AlertBanner
 * Renders a gradient red banner at the top of the Overview page when one or
 * more critical alerts are active. If no critical alerts exist, renders nothing.
 *
 * The layout matches the Figma design: a warning icon on the left, with the
 * count message and "View all alerts" link stacked vertically beside it.
 *
 * @prop alerts — full list of active Alert objects; the component filters for
 *   severity === 'critical' internally
 */

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/types';
import { ALERT_SEVERITY_VALUES } from '@/lib/constants';

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const criticalAlerts = alerts.filter(
    (a) => a.severity === ALERT_SEVERITY_VALUES.critical,
  );

  if (criticalAlerts.length === 0) return null;

  const count = criticalAlerts.length;

  return (
    <div className="rounded-xl border border-red-500/50 bg-gradient-to-r from-red-500/20 to-red-600/20 px-5 py-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="size-6 shrink-0 text-red-400" />
        <div>
          <p className="font-body text-base font-medium text-white">
            {count} critical alert{count > 1 ? 's' : ''} require immediate
            attention
          </p>
          <Link
            href="/alerts"
            className="font-body text-sm text-red-300 underline transition-colors hover:text-red-100"
          >
            View all alerts &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
