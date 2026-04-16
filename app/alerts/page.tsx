"use client"

/**
 * AlertsPage
 * Screen 6 — Alerts table with search and a filters sheet (status, severity, sort).
 */

import { AlertStatCard } from "@/components/dashboard/alerts/AlertStatCard"
import { AlertTable } from "@/components/dashboard/alerts/AlertTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALERT_SEVERITY_VALUES } from "@/lib/constants"
import { useAlerts } from "@/hooks/useAlerts"
import { useNodes } from "@/hooks/useNodes"
import {
  Alert,
  AlertResolutionFilter,
  AlertSeverityUiFilter,
  AlertSortOption,
  AlertSeverity,
} from "@/types"
import { Filter, Search } from "lucide-react"
import { useMemo, useState } from "react"

const DEFAULT_FILTERS: {
  resolution: AlertResolutionFilter
  severity: AlertSeverityUiFilter
  sort: AlertSortOption
} = {
  resolution: "all",
  severity: "all",
  sort: "created_desc",
}

const SORT_LABELS: Record<AlertSortOption, string> = {
  created_desc: "Newest first",
  created_asc: "Oldest first",
  severity_desc: "Severity (critical first)",
  severity_asc: "Severity (info first)",
  type_asc: "Alert type (A–Z)",
  node_asc: "Node name (A–Z)",
}

/**
 * Orders alerts for the table according to the selected sort option.
 */
function sortAlerts(
  rows: Alert[],
  sort: AlertSortOption,
  nodeNameById: Record<string, string>
): Alert[] {
  const severityRank = (s: AlertSeverity) =>
    s === ALERT_SEVERITY_VALUES.critical
      ? 0
      : s === ALERT_SEVERITY_VALUES.warning
        ? 1
        : 2

  const nodeLabel = (a: Alert) =>
    a.nodeId ? (nodeNameById[a.nodeId] ?? "") : "System"

  const byTime = (a: Alert, b: Alert) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

  return [...rows].sort((a, b) => {
    switch (sort) {
      case "created_desc":
        return byTime(b, a)
      case "created_asc":
        return byTime(a, b)
      case "severity_desc": {
        const d = severityRank(a.severity) - severityRank(b.severity)
        return d !== 0 ? d : byTime(b, a)
      }
      case "severity_asc": {
        const d = severityRank(b.severity) - severityRank(a.severity)
        return d !== 0 ? d : byTime(a, b)
      }
      case "type_asc":
        return a.type.localeCompare(b.type) || byTime(b, a)
      case "node_asc":
        return nodeLabel(a).localeCompare(nodeLabel(b)) || byTime(b, a)
      default:
        return 0
    }
  })
}

export default function AlertsPage() {
  const [search, setSearch] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [draft, setDraft] = useState(DEFAULT_FILTERS)

  const { alerts, isLoading } = useAlerts()
  const { nodes } = useNodes()

  const nodeNameById = useMemo(
    () =>
      nodes.reduce<Record<string, string>>((acc, node) => {
        acc[node.id] = node.name
        return acc
      }, {}),
    [nodes]
  )

  const filteredSortedAlerts = useMemo(() => {
    let rows = alerts

    if (applied.resolution === "active") {
      rows = rows.filter((a) => !a.resolved)
    } else if (applied.resolution === "resolved") {
      rows = rows.filter((a) => a.resolved)
    }

    if (applied.severity !== "all") {
      rows = rows.filter((a) => a.severity === applied.severity)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter((a) => {
        const nodeName = a.nodeId
          ? (nodeNameById[a.nodeId] ?? "").toLowerCase()
          : "system"
        return (
          a.message.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          nodeName.includes(q)
        )
      })
    }

    return sortAlerts(rows, applied.sort, nodeNameById)
  }, [alerts, applied, search, nodeNameById])

  const activeCount = alerts.filter((a) => !a.resolved).length
  const resolvedCount = alerts.length - activeCount

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open)
    if (open) {
      setDraft(applied)
    }
  }

  function applyFilters() {
    setApplied(draft)
    setSheetOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Alerts
        </h1>
        <p className="mt-2 font-body text-base text-muted-foreground">
          Search alerts and refine the table with filters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AlertStatCard label="Active" value={activeCount} tone="active" />
        <AlertStatCard label="Resolved" value={resolvedCount} tone="resolved" />
        <AlertStatCard label="Total" value={alerts.length} tone="total" />
      </div>

      <Card className="gap-0 overflow-hidden rounded-[14px] border border-border bg-background py-0 shadow-none ring-0">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md min-w-0">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search messages, nodes, alert types…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Search alerts"
            />
          </div>

          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 gap-2 border-border font-body"
              onClick={() => handleSheetOpenChange(true)}
            >
              <Filter className="size-4" aria-hidden />
              Filters
            </Button>

            <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-heading text-base">
                  Filter alerts
                </SheetTitle>
                <SheetDescription>
                  Choose status, severity, and sorting. Changes apply when you
                  click Apply changes.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="filter-status" className="font-body text-sm">
                    Status
                  </Label>
                  <Select
                    value={draft.resolution}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        resolution: v as AlertResolutionFilter,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="filter-status"
                      className="w-full min-w-0 justify-between"
                      size="default"
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="filter-severity" className="font-body text-sm">
                    Severity
                  </Label>
                  <Select
                    value={draft.severity}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        severity: v as AlertSeverityUiFilter,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="filter-severity"
                      className="w-full min-w-0 justify-between"
                      size="default"
                    >
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value={ALERT_SEVERITY_VALUES.critical}>
                        Critical
                      </SelectItem>
                      <SelectItem value={ALERT_SEVERITY_VALUES.warning}>
                        Warning
                      </SelectItem>
                      <SelectItem value={ALERT_SEVERITY_VALUES.info}>
                        Info
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="filter-sort" className="font-body text-sm">
                    Sort by
                  </Label>
                  <Select
                    value={draft.sort}
                    onValueChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        sort: v as AlertSortOption,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="filter-sort"
                      className="w-full min-w-0 justify-between"
                      size="default"
                    >
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        [
                          "created_desc",
                          "created_asc",
                          "severity_desc",
                          "severity_asc",
                          "type_asc",
                          "node_asc",
                        ] as const satisfies readonly AlertSortOption[]
                      ).map((key) => (
                        <SelectItem key={key} value={key}>
                          {SORT_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="border-t border-border">
                <Button
                  type="button"
                  className="w-full font-body"
                  onClick={applyFilters}
                >
                  Apply changes
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <AlertTable
          alerts={filteredSortedAlerts}
          nodeNameById={nodeNameById}
          isLoading={isLoading}
        />
      </Card>
    </div>
  )
}
