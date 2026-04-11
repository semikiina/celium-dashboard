"use client"

/**
 * useNodes
 * Fetches the full node list with each node's latest reading.
 * Refreshes every 5 seconds via {@link READINGS_REFRESH_INTERVAL} (includes per-node latestReading).
 */

import useSWR from "swr"
import { Node, Reading } from "@/types"
import { READINGS_REFRESH_INTERVAL } from "@/lib/constants"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useNodes(): {
  nodes: (Node & { latestReading: Reading | null })[]
  isLoading: boolean
  error: unknown
} {
  const { data, isLoading, error } = useSWR<
    (Node & { latestReading: Reading | null })[]
  >("/api/nodes", fetcher, {
    refreshInterval: READINGS_REFRESH_INTERVAL,
  })

  return { nodes: data ?? [], isLoading, error }
}
