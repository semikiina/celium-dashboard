"use client"

/**
 * AlertTable
 * Tabular list of alerts for the Alerts page: severity, status, message, node,
 * alert type, and raised time.
 *
 * @prop alerts        — rows to display (already filtered and sorted)
 * @prop nodeNameById  — map from node id to display name
 * @prop isLoading     — when true, shows skeleton rows
 */

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ALERT_SEVERITY_COLOURS, ALERT_SEVERITY_VALUES } from "@/lib/constants"
import { cn, formatAbsoluteDateTime } from "@/lib/utils"
import { Alert, AlertSeverity } from "@/types"

interface AlertTableProps {
  alerts: Alert[]
  nodeNameById: Record<string, string>
  isLoading: boolean
}

const COLUMN_COUNT = 6
const SKELETON_ROWS = 6

const thClass =
  "px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground"

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  [ALERT_SEVERITY_VALUES.critical]: "Critical",
  [ALERT_SEVERITY_VALUES.warning]: "Warning",
  [ALERT_SEVERITY_VALUES.info]: "Info",
}

export function AlertTable({ alerts, nodeNameById, isLoading }: AlertTableProps) {
  return (
    <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted hover:bg-muted">
            <TableHead className={thClass}>Severity</TableHead>
            <TableHead className={thClass}>Status</TableHead>
            <TableHead className={thClass}>Message</TableHead>
            <TableHead className={thClass}>Node</TableHead>
            <TableHead className={thClass}>Alert type</TableHead>
            <TableHead className={thClass}>Raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <SkeletonRows />}

          {!isLoading && alerts.length === 0 && (
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableCell
                colSpan={COLUMN_COUNT}
                className="px-6 py-12 text-center font-body text-sm text-muted-foreground"
              >
                No alerts match your search or filters.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            alerts.map((alert) => {
              const nodeName = alert.nodeId
                ? (nodeNameById[alert.nodeId] ?? "Unknown")
                : "System"
              const { time, date } = formatAbsoluteDateTime(alert.createdAt)

              return (
                <TableRow
                  key={alert.id}
                  className="border-border/50 border-b hover:bg-muted/60"
                >
                  <TableCell className="px-6 py-4 align-top">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-2 py-0.5 font-body text-[11px] font-medium uppercase",
                        ALERT_SEVERITY_COLOURS[alert.severity]
                      )}
                    >
                      {SEVERITY_LABEL[alert.severity]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-top">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-2 py-0.5 font-body text-[11px] font-medium uppercase",
                        alert.resolved
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                          : "border-zinc-500/50 bg-zinc-500/20 text-zinc-200"
                      )}
                    >
                      {alert.resolved ? "Resolved" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md px-6 py-4 align-top">
                    <p className="font-body text-sm leading-snug text-foreground">
                      {alert.message}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-top">
                    {alert.nodeId ? (
                      <Link
                        href={`/nodes/${alert.nodeId}`}
                        className="font-body text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {nodeName}
                      </Link>
                    ) : (
                      <span className="font-body text-sm text-muted-foreground">
                        {nodeName}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 align-top">
                    <span className="font-mono text-xs text-muted-foreground">
                      {alert.type}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-top">
                    <p className="font-body text-sm text-foreground">{time}</p>
                    {date ? (
                      <p className="mt-0.5 font-body text-xs text-muted-foreground">
                        {date}
                      </p>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
  )
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <TableRow
          key={`alert-skel-${i}`}
          className="border-border/50 hover:bg-transparent"
        >
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="mt-1 h-4 max-w-sm w-[72%]" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <Skeleton className="h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
