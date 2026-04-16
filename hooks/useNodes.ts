"use client"

/**
 * useNodes
 * Fetches the full node list with each node's latest reading.
 * Refreshes every minute via {@link NODES_LIST_REFRESH_INTERVAL}.
 */

import useSWR from "swr"
import { Node, Reading } from "@/types"
import { NODES_LIST_REFRESH_INTERVAL } from "@/lib/constants"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useNodes(): {
  nodes: (Node & { latestReading: Reading | null })[]
  isLoading: boolean
  error: unknown
} {
  const { data, isLoading, error } = useSWR<
    (Node & { latestReading: Reading | null })[]
  >("/api/nodes", fetcher, {
    refreshInterval: NODES_LIST_REFRESH_INTERVAL,
  })

  return { nodes: data ?? [], isLoading, error }
}
