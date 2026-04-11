/**
 * GET /api/nodes/:id/readings
 * Returns time-series readings for a single node, ordered by timestamp ascending.
 * Supports optional query parameters:
 *   - limit  (default 200, max 1000) — number of readings to return
 *   - from   — ISO 8601 start timestamp
 *   - to     — ISO 8601 end timestamp
 */

import { createClient } from "@/lib/supabase"
import { Reading, ReadingRow } from "@/types"
import { NextRequest, NextResponse } from "next/server"

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "Missing node id" }, { status: 400 })
  }

  const searchParams = request.nextUrl.searchParams
  const limitParam = searchParams.get("limit")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const limit = Math.min(
    Math.max(parseInt(limitParam ?? "200", 10) || 200, 1),
    1000
  )

  const supabase = createClient()

  let query = supabase
    .from("readings")
    .select("*")
    .eq("node_id", id)
    .order("timestamp", { ascending: true })
    .limit(limit)

  if (from) {
    query = query.gte("timestamp", from)
  }
  if (to) {
    query = query.lte("timestamp", to)
  }

  const { data, error } = await query.returns<ReadingRow[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data ?? []).map(mapRowToReading))
}
