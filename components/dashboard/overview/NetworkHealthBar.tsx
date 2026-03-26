/**
 * NetworkHealthBar
 * Renders the "Network Health" panel for the Overview page. Shows:
 *   - Average battery level as a gradient progress bar
 *   - Average signal strength (RSSI) as a gradient progress bar
 *   - Status breakdown counts (Active, Warning, Critical, Offline)
 *
 * Matches the Figma design with brand-navy background, gradient bars,
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

const BAR_GRADIENT =
  'linear-gradient(90deg, #1784E3, #5DD4D8)';

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
    <div className="rounded-xl border border-brand-blue/20 bg-brand-navy p-6">
      <h2 className="font-heading text-xl font-bold text-white">
        Network Health
      </h2>

      <div className="mt-5 space-y-4">
        {/* Average Battery */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="size-4 text-zinc-400" />
              <span className="font-body text-sm text-zinc-300">
                Average Battery
              </span>
            </div>
            <span className="font-body text-sm font-medium text-white">
              {avgBatteryPct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-dark">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(Math.max(avgBatteryPct, 0), 100)}%`,
                backgroundImage: BAR_GRADIENT,
              }}
            />
          </div>
        </div>

        {/* Signal Strength */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Signal className="size-4 text-zinc-400" />
              <span className="font-body text-sm text-zinc-300">
                Signal Strength
              </span>
            </div>
            <span className="font-body text-sm font-medium text-white">
              {avgRssi} dBm
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-dark">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${rssiPct}%`,
                backgroundImage: BAR_GRADIENT,
              }}
            />
          </div>
        </div>
      </div>

      {/* Status counts */}
      <div className="mt-6 grid grid-cols-4 gap-2 border-t border-brand-blue/20 pt-5">
        <StatusCount value={activeCount} label="Active" color="text-emerald-400" />
        <StatusCount value={warningCount} label="Warning" color="text-amber-400" />
        <StatusCount value={criticalAlerts} label="Critical" color="text-red-400" />
        <StatusCount value={offlineCount} label="Offline" color="text-zinc-400" />
      </div>
    </div>
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
      <p className={`font-heading text-2xl font-bold ${color}`}>{value}</p>
      <p className="font-body text-xs text-zinc-500">{label}</p>
    </div>
  );
}
