"use client"

/**
 * useReadings
 * Fetches time-series readings for a single node from /api/nodes/:id/readings.
 * Refreshes every 5 seconds ({@link READINGS_REFRESH_INTERVAL}).
 *
 * @param nodeId — the UUID of the node
 * @param limit  — max readings to fetch (default 200)
 */

import useSWR from "swr"
import { Reading } from "@/types"
import { READINGS_REFRESH_INTERVAL } from "@/lib/constants"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useReadings(
  nodeId: string | undefined,
  limit = 200
): {
  readings: Reading[]
  isLoading: boolean
  error: unknown
} {
  const { data, isLoading, error } = useSWR<Reading[]>(
    nodeId ? `/api/nodes/${nodeId}/readings?limit=${limit}` : null,
    fetcher,
    { refreshInterval: READINGS_REFRESH_INTERVAL }
  )

  return { readings: data ?? [], isLoading, error }
}
