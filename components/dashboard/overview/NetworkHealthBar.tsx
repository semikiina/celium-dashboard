/**
 * NetworkHealthBar
 * Renders the "Network Health" panel for the Overview page. Shows:
 *   - Average battery level as a gradient progress bar
 *   - Average signal strength (RSSI) as a gradient progress bar
 *   - Status breakdown counts (Active, Warning, Critical, Offline)
 *
 * Matches the Figma design with semantic background, gradient bars,
 * and colour-coded status counts.
 *
 * @prop avgBatteryPct   — average battery percentage across all nodes (0–100)
 * @prop avgRssi         — average RSSI in dBm (typically -120 to -30)
 * @prop activeCount     — nodes with status 'online'
 * @prop warningCount    — nodes with status 'warning'
 * @prop criticalAlerts  — count of unresolved critical alerts
 * @prop offlineCount    — nodes with status 'offline'
 */

import { Battery, Signal } from 'lucide-react';
import { NETWORK_HEALTH_BAR_FILL_CLASS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface NetworkHealthBarProps {
  avgBatteryPct: number;
  avgRssi: number;
  activeCount: number;
  warningCount: number;
  criticalAlerts: number;
  offlineCount: number;
}

function rssiToPercent(rssi: number): number {
  const clamped = Math.max(-120, Math.min(-30, rssi));
  return Math.round(((clamped + 120) / 90) * 100);
}

export function NetworkHealthBar({
  avgBatteryPct,
  avgRssi,
  activeCount,
  warningCount,
  criticalAlerts,
  offlineCount,
}: NetworkHealthBarProps) {
  const rssiPct = rssiToPercent(avgRssi);

  return (
    <Card className="gap-0 rounded-xl border border-border bg-background py-0 shadow-none ring-0">
      <CardHeader className="px-6 pb-0 pt-6">
        <CardTitle className="font-heading text-xl font-bold text-foreground">
          Network Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="size-4 text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">
                Average Battery
              </span>
            </div>
            <span className="font-body text-sm font-medium text-foreground">
              {avgBatteryPct}%
            </span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                NETWORK_HEALTH_BAR_FILL_CLASS,
              )}
              style={{
                width: `${Math.min(Math.max(avgBatteryPct, 0), 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Signal className="size-4 text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">
                Signal Strength
              </span>
            </div>
            <span className="font-body text-sm font-medium text-foreground">
              {avgRssi} dBm
            </span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                NETWORK_HEALTH_BAR_FILL_CLASS,
              )}
              style={{ width: `${rssiPct}%` }}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-4 gap-2">
          <StatusCount
            value={activeCount}
            label="Active"
            color="text-emerald-400"
          />
          <StatusCount
            value={warningCount}
            label="Warning"
            color="text-amber-400"
          />
          <StatusCount
            value={criticalAlerts}
            label="Critical"
            color="text-red-400"
          />
          <StatusCount
            value={offlineCount}
            label="Offline"
            color="text-muted-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatusCountProps {
  value: number;
  label: string;
  color: string;
}

function StatusCount({ value, label, color }: StatusCountProps) {
  return (
    <div className="text-center">
      <p className={cn('font-heading text-2xl font-bold', color)}>{value}</p>
      <p className="font-body text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
