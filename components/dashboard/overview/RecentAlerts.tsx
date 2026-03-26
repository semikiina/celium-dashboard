/**
 * RecentAlerts
 * Renders a panel showing the most recent alerts on the Overview page.
 * Displays up to 3 alert items with severity badges, timestamps, messages,
 * and affected node names. Includes a "View all" link to the alerts page.
 *
 * @prop alerts — array of active Alert objects (up to 3 are displayed)
 * @prop nodes  — full node array used to resolve node names from nodeId
 */

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Alert, Node } from '@/types';
import { ALERT_SEVERITY_VALUES } from '@/lib/constants';

interface RecentAlertsProps {
  alerts: Alert[];
  nodes: Node[];
}

const SEVERITY_BADGE: Record<string, { bg: string; border: string; text: string; label: string }> = {
  [ALERT_SEVERITY_VALUES.critical]: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-300',
    label: 'CRITICAL',
  },
  [ALERT_SEVERITY_VALUES.warning]: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
    label: 'HIGH',
  },
  [ALERT_SEVERITY_VALUES.info]: {
    bg: 'bg-brand-blue/20',
    border: 'border-brand-blue/30',
    text: 'text-brand-blue',
    label: 'INFO',
  },
};

function formatAlertTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

export function RecentAlerts({ alerts, nodes }: RecentAlertsProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n.name]));
  const recentAlerts = alerts.slice(0, 3);

  return (
    <div className="rounded-xl border border-brand-blue/20 bg-brand-navy p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-white">
          Recent Alerts
        </h2>
        <Link
          href="/alerts"
          className="font-body text-sm text-brand-cyan transition-colors hover:text-brand-cyan/80"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {recentAlerts.length === 0 ? (
          <p className="py-8 text-center font-body text-sm text-zinc-500">
            No active alerts
          </p>
        ) : (
          recentAlerts.map((alert) => {
            const badge = SEVERITY_BADGE[alert.severity] ?? SEVERITY_BADGE.info;
            const nodeName = alert.nodeId
              ? nodeMap.get(alert.nodeId) ?? 'Unknown Node'
              : 'System';

            return (
              <div
                key={alert.id}
                className="rounded-[10px] border border-brand-blue/10 bg-brand-dark p-3"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 font-body text-xs font-medium ${badge.bg} ${badge.border} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                      <span className="font-body text-xs text-zinc-500">
                        {formatAlertTime(alert.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-sm leading-5 text-zinc-300">
                      {alert.message}
                    </p>
                    <p className="mt-1 font-body text-xs text-zinc-500">
                      {nodeName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
