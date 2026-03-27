'use client';

/**
 * useNode
 * Fetches a single node by ID from /api/nodes/:id, including its latest reading.
 * Refreshes every 30 seconds.
 */

import useSWR from 'swr';
import { Node, Reading } from '@/types';
import { REFRESH_INTERVAL } from '@/lib/constants';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export type NodeWithLatestReading = Node & { latestReading: Reading | null };

export function useNode(id: string | undefined): {
  node: NodeWithLatestReading | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { data, isLoading, error } = useSWR<NodeWithLatestReading>(
    id ? `/api/nodes/${id}` : null,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL },
  );

  return { node: data, isLoading, error };
}
