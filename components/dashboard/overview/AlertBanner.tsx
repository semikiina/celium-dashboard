/**
 * AlertBanner
 * Renders a sticky red banner at the top of the Overview page when one or more
 * critical alerts are active. If no critical alerts exist, renders nothing.
 *
 * The banner is sticky within the overview page scroll container (not the full
 * viewport) so it remains visible as the user scrolls through the page content.
 *
 * @prop alerts — full list of active Alert objects; the component filters for
 *   severity === ALERT_SEVERITY_VALUES.critical internally
 */

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/types';
import {
  ALERT_SEVERITY_VALUES,
  CRITICAL_BANNER_STYLES,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

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
    <div
      className={cn(
        'sticky top-0 z-10 flex w-full items-center justify-between px-4 py-2',
        CRITICAL_BANNER_STYLES.container,
      )}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className={cn('size-5', CRITICAL_BANNER_STYLES.icon)} />
        <span
          className={cn(
            'font-body text-sm font-bold',
            CRITICAL_BANNER_STYLES.text,
          )}
        >
          {count} critical alert{count > 1 ? 's' : ''} require attention
        </span>
      </div>

      <Link
        href="/alerts"
        className={cn(
          'font-body text-sm font-medium transition-colors',
          CRITICAL_BANNER_STYLES.link,
        )}
      >
        View Alerts &rarr;
      </Link>
    </div>
  );
}
