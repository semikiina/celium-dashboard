/**
 * Shared helpers: className merging (`cn`) and small formatting utilities for the dashboard.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
})

/**
 * Formats an ISO timestamp as clock time plus an optional calendar date line.
 */
export function formatAbsoluteDateTime(iso: string | null): {
  time: string
  date: string | undefined
} {
  if (!iso) {
    return { time: "—", date: undefined }
  }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return { time: "—", date: undefined }
  }
  return {
    time: timeFormatter.format(d),
    date: dateFormatter.format(d),
  }
}

/**
 * Returns a short human-readable relative time string (e.g. "2m ago").
 */
export function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—"
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return "—"
  const sec = Math.round((Date.now() - then) / 1000)
  if (sec < 60) return `${Math.max(0, sec)}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 48) return `${hr}h ago`
  const day = Math.round(hr / 24)
  return `${day}d ago`
}

/**
 * Formats lat/lng for table cells; returns an em dash when coordinates are missing.
 */
export function formatCoordinates(
  lat: number | null,
  lng: number | null
): string {
  if (lat === null || lng === null) return "—"
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

/**
 * Tailwind text colour class for RSSI (dBm): stronger signal → greener.
 */
export function getSignalColourClass(rssi: number): string {
  if (rssi >= -70) return "text-emerald-400"
  if (rssi >= -85) return "text-amber-400"
  return "text-red-400"
}
