/**
 * Shared utility functions used across the Celium Dashboard.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

/**
 * formatRelativeTime
 * Converts an ISO timestamp into a human-readable relative string
 * (e.g. "2 min ago", "1 hr ago", "3 days ago").
 * Returns "—" when the input is null or undefined.
 */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';

  const diff = Date.now() - new Date(iso).getTime();

  if (diff < 0) return 'just now';
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins} min ago`;
  }
  if (diff < DAY) {
    const hrs = Math.floor(diff / HOUR);
    return `${hrs} hr ago`;
  }

  const days = Math.floor(diff / DAY);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
