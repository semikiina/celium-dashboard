"use client"

/**
 * useAlerts
 * Fetches alerts from `/api/alerts` and optionally filters by resolved status.
 * Refreshes every 30 seconds to keep the alert feed current.
 */

import useSWR from "swr"
import { REFRESH_INTERVAL } from "@/lib/constants"
import { Alert } from "@/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UseAlertsOptions {
  resolved?: boolean
}

/**
 * Returns the alert list and SWR request state for the Alerts page/feed.
 */
export function useAlerts(options?: UseAlertsOptions): {
  alerts: Alert[]
  isLoading: boolean
  error: unknown
} {
  const query =
    options?.resolved === undefined
      ? ""
      : `?resolved=${String(options.resolved)}`
  const endpoint = `/api/alerts${query}`

  const { data, isLoading, error } = useSWR<Alert[]>(endpoint, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  })

  return {
    alerts: data ?? [],
    isLoading,
    error,
  }
}
