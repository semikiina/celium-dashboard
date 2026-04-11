/**
 * GET /api/nodes/latest-readings
 * Returns a flat array containing the most recent Reading per node.
 * Equivalent to: SELECT DISTINCT ON (node_id) * FROM readings ORDER BY node_id, timestamp DESC
 *
 * Because the Supabase JS client does not support DISTINCT ON, we fetch
 * readings ordered by (node_id, timestamp DESC) and deduplicate in JS.
 * This is acceptable for MVP data volumes.
 */

import { createClient } from "@/lib/supabase"
import { Reading, ReadingRow } from "@/types"
import { NextResponse } from "next/server"

function mapRowToReading(row: ReadingRow): Reading {
  return {
    id: row.id,
    nodeId: row.node_id,
    timestamp: row.timestamp,
    temperature: row.temperature,
    humidity: row.humidity,
    pressure: row.pressure,
    rssi: row.rssi,
    snr: row.snr,
    spreadingFactor: row.spreading_factor,
    batteryVoltage: row.battery_voltage,
    batteryPct: row.battery_pct,
    hopCount: row.hop_count,
    seqNum: row.seq_num,
    rawPayload: row.raw_payload,
  }
}

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .order("node_id", { ascending: true })
    .order("timestamp", { ascending: false })
    .returns<ReadingRow[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const seen = new Set<string>()
  const latest: Reading[] = []

  for (const row of data ?? []) {
    if (seen.has(row.node_id)) continue
    seen.add(row.node_id)
    latest.push(mapRowToReading(row))
  }

  return NextResponse.json(latest)
}
