/**
 * AlertStatCard
 * Summary metric card for the Alerts page header: label, large value, and a
 * subtle tinted surface (active / resolved / total).
 *
 * @prop label — short title (e.g. "Active")
 * @prop value — numeric count
 * @prop tone  — accent: active (red), resolved (emerald), or total (neutral)
 */

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AlertStatCardProps {
  label: string
  value: number
  tone: "active" | "resolved" | "total"
}

const toneClassName: Record<AlertStatCardProps["tone"], string> = {
  active:
    "border-red-500/35 bg-red-500/[0.08] shadow-none ring-1 ring-red-500/15",
  resolved:
    "border-emerald-500/35 bg-emerald-500/[0.08] shadow-none ring-1 ring-emerald-500/15",
  total:
    "border-zinc-600/50 bg-zinc-800/60 shadow-none ring-1 ring-zinc-700/40",
}

const valueClassName: Record<AlertStatCardProps["tone"], string> = {
  active: "text-red-300",
  resolved: "text-emerald-300",
  total: "text-zinc-100",
}

export function AlertStatCard({ label, value, tone }: AlertStatCardProps) {
  return (
    <Card
      className={cn(
        "min-w-0 flex-1 rounded-xl border py-0",
        toneClassName[tone]
      )}
    >
      <CardContent className="flex flex-col gap-1 px-5 py-5 sm:px-6 sm:py-6">
        <p className="font-body text-sm font-medium text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "font-heading text-3xl font-bold tabular-nums tracking-tight",
            valueClassName[tone]
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
