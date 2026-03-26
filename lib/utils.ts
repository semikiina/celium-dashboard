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

/**
 * formatAbsoluteDateTime
 * Returns { time, date } strings from an ISO timestamp, e.g.
 * { time: "10:27:00 AM", date: "3/20/2026" }.
 * Returns { time: '—', date: '' } when the input is null.
 */
export function formatAbsoluteDateTime(iso: string | null | undefined): {
  time: string;
  date: string;
} {
  if (!iso) return { time: '—', date: '' };

  const d = new Date(iso);
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const date = d.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  return { time, date };
}

/**
 * getSignalColourClass
 * Returns a Tailwind text colour class based on RSSI signal strength:
 *   >= -70 dBm → green (good), -70 to -85 → amber (moderate), < -85 → red (poor).
 */
export function getSignalColourClass(rssi: number): string {
  if (rssi >= -70) return 'text-green-400';
  if (rssi >= -85) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * formatCoordinates
 * Formats lat/lng to a compact display string.
 * Returns '—' when either value is null.
 */
export function formatCoordinates(
  lat: number | null,
  lng: number | null,
): string {
  if (lat === null || lng === null) return '—';
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}
