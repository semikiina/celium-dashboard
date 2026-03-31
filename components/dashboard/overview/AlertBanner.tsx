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
import {
  ALERT_SEVERITY_VALUES,
  CRITICAL_BANNER_STYLES,
} from '@/lib/constants';
import {
  Alert as AlertUI,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

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
    <AlertUI className={CRITICAL_BANNER_STYLES.alert} variant="default">
      <AlertTriangle />
      <AlertTitle className={CRITICAL_BANNER_STYLES.title}>
        {count} critical alert{count > 1 ? 's' : ''} require immediate
        attention
      </AlertTitle>
      <AlertDescription className="mt-0">
        <Link href="/alerts" className={CRITICAL_BANNER_STYLES.link}>
          View all alerts &rarr;
        </Link>
      </AlertDescription>
    </AlertUI>
  );
}
