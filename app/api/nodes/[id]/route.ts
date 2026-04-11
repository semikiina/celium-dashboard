/**
 * GET /api/nodes/:id
 * Returns a single node by its UUID, including the latest reading.
 */

import { createClient } from "@/lib/supabase"
import { Node, NodeRow, Reading, ReadingRow } from "@/types"
import { NextRequest, NextResponse } from "next/server"

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "Missing node id" }, { status: 400 })
  }

  const supabase = createClient()

  const [nodeResult, readingResult] = await Promise.all([
    supabase.from("nodes").select("*").eq("id", id).single<NodeRow>(),
    supabase
      .from("readings")
      .select("*")
      .eq("node_id", id)
      .order("timestamp", { ascending: false })
      .limit(1)
      .returns<ReadingRow[]>(),
  ])

  if (nodeResult.error) {
    const status = nodeResult.error.code === "PGRST116" ? 404 : 500
    return NextResponse.json({ error: nodeResult.error.message }, { status })
  }

  if (readingResult.error) {
    return NextResponse.json(
      { error: readingResult.error.message },
      { status: 500 }
    )
  }

  const latestReading =
    readingResult.data && readingResult.data.length > 0
      ? mapRowToReading(readingResult.data[0])
      : null

  return NextResponse.json({
    ...mapRowToNode(nodeResult.data),
    latestReading,
  })
}
