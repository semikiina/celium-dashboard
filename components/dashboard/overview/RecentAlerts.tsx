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
import { Alert, Node, type AlertSeverity } from '@/types';
import { ALERT_SEVERITY_COLOURS, ALERT_SEVERITY_VALUES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RecentAlertsProps {
  alerts: Alert[];
  nodes: Node[];
}

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  [ALERT_SEVERITY_VALUES.critical]: 'CRITICAL',
  [ALERT_SEVERITY_VALUES.warning]: 'HIGH',
  [ALERT_SEVERITY_VALUES.info]: 'INFO',
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
    <Card className="gap-0 rounded-xl border border-border bg-background py-0 shadow-none ring-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-6 pb-0 pt-6">
        <CardTitle className="font-heading text-xl font-bold text-foreground">
          Recent Alerts
        </CardTitle>
        <Button variant="link" asChild className="h-auto p-0 font-body text-sm text-primary">
          <Link href="/alerts">View all &rarr;</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-6 pb-6 pt-4">
        {recentAlerts.length === 0 ? (
          <p className="py-8 text-center font-body text-sm text-muted-foreground">
            No active alerts
          </p>
        ) : (
          recentAlerts.map((alert) => {
            const severityKey = alert.severity;
            const badgeClass = ALERT_SEVERITY_COLOURS[severityKey];
            const label = SEVERITY_LABEL[severityKey];
            const nodeName = alert.nodeId
              ? (nodeMap.get(alert.nodeId) ?? 'Unknown Node')
              : 'System';

            return (
              <div
                key={alert.id}
                className="bg-muted rounded-[10px] border border-border/50 p-3"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-auto rounded-full border px-2 py-0.5 font-body text-xs font-medium uppercase shadow-none',
                          badgeClass,
                        )}
                      >
                        {label}
                      </Badge>
                      <span className="font-body text-xs text-muted-foreground">
                        {formatAlertTime(alert.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-sm leading-5 text-foreground">
                      {alert.message}
                    </p>
                    <p className="mt-1 font-body text-xs text-muted-foreground">
                      {nodeName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
