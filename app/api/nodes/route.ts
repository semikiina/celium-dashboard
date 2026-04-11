/**
 * GET /api/nodes
 * Returns all nodes joined with their latest reading.
 * Each item is shaped as Node & { latestReading: Reading | null }.
 *
 * Fetches all rows from `nodes`, then fetches the most recent row from
 * `readings` per node (DISTINCT ON emulated in JS) and merges them.
 */

import { createClient } from "@/lib/supabase"
import { Node, NodeRow, Reading, ReadingRow } from "@/types"
import { NextResponse } from "next/server"

function mapRowToNode(row: NodeRow): Node {
  return {
    id: row.id,
    externalId: row.external_id,
    name: row.name,
    type: row.type,
    status: row.status,
    gatewayId: row.gateway_id,
    lat: row.lat,
    lng: row.lng,
    firmwareVer: row.firmware_ver,
    hardwareVer: row.hardware_ver,
    batteryPct: row.battery_pct,
    deployedAt: row.deployed_at,
    lastSeenAt: row.last_seen_at,
  }
}

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

  const [nodesResult, readingsResult] = await Promise.all([
    supabase
      .from("nodes")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<NodeRow[]>(),
    supabase
      .from("readings")
      .select("*")
      .order("node_id", { ascending: true })
      .order("timestamp", { ascending: false })
      .returns<ReadingRow[]>(),
  ])

  if (nodesResult.error) {
    return NextResponse.json(
      { error: nodesResult.error.message },
      { status: 500 }
    )
  }

  if (readingsResult.error) {
    return NextResponse.json(
      { error: readingsResult.error.message },
      { status: 500 }
    )
  }

  const latestByNodeId = new Map<string, Reading>()
  for (const row of readingsResult.data ?? []) {
    if (!latestByNodeId.has(row.node_id)) {
      latestByNodeId.set(row.node_id, mapRowToReading(row))
    }
  }

  const data = (nodesResult.data ?? []).map((row) => ({
    ...mapRowToNode(row),
    latestReading: latestByNodeId.get(row.id) ?? null,
  }))

  return NextResponse.json(data)
}
