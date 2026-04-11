/**
 * Local telemetry simulator: appends synthetic readings to Supabase on a fixed interval.
 *
 * Required env (same pattern as `scripts/seed.ts`):
 * - NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY — required for most projects: RLS on `readings` blocks anon inserts.
 *   Copy from Supabase → Project Settings → API → service_role (secret). Put in `.env.local` only;
 *   never commit or expose in client code.
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY — used only as fallback if your RLS policy allows inserts (rare)
 *
 * Optional:
 * - SIMULATOR_INTERVAL_MS — milliseconds between insert batches (default: 5000)
 *
 * Behaviour: On each tick, loads every row from `nodes` and inserts one new `readings` row per
 * node (time-series append). Values drift from the node’s previous latest reading; `seq_num`
 * increases monotonically per node. `raw_payload` follows the canonical shape in ARCHITECTURE.md.
 *
 * Stop with Ctrl+C (clears the interval). Sustained use grows `readings`; truncate the table or
 * re-run `npm run seed` if local demos need a reset.
 */

import fs from "node:fs"
import path from "node:path"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { NodeRow, NodeStatus, NodeType, ReadingRow } from "../types"

function getSupabaseCredentials(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  return { url, key }
}

function parseEnvFileLine(line: string): [string, string] | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) {
    return null
  }

  const separatorIndex = trimmed.indexOf("=")
  if (separatorIndex === -1) {
    return null
  }

  const key = trimmed.slice(0, separatorIndex).trim()
  const value = trimmed
    .slice(separatorIndex + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "")

  if (!key) {
    return null
  }

  return [key, value]
}

function loadLocalEnvFallback(): void {
  const candidatePaths = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
  ]

  for (const candidatePath of candidatePaths) {
    if (!fs.existsSync(candidatePath)) {
      continue
    }

    const fileContent = fs.readFileSync(candidatePath, "utf8")
    const lines = fileContent.split("\n")

    for (const line of lines) {
      const parsed = parseEnvFileLine(line)
      if (!parsed) {
        continue
      }
      const [key, value] = parsed
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  }
}

function assertNoError(
  operation: string,
  error: { message: string } | null
): void {
  if (error) {
    throw new Error(`[${operation}] ${error.message}`)
  }
}

function writeProgress(message: string): void {
  process.stdout.write(`${message}\n`)
}

function isRlsViolationMessage(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes("row-level security") ||
    lower.includes("violates row-level security")
  )
}

let rlsHintEmitted = false

function writeRlsHintOnce(): void {
  if (rlsHintEmitted) {
    return
  }
  rlsHintEmitted = true
  process.stderr.write(
    "\n  Inserts are blocked by RLS. Add to .env.local:\n\n    SUPABASE_SERVICE_ROLE_KEY=<service_role secret from Supabase Dashboard → Settings → API>\n\n  Restart the simulator. Do not commit this key.\n\n"
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function round(value: number, decimals: number): number {
  return Number(value.toFixed(decimals))
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function deriveBatteryPct(voltage: number): number {
  const minVoltage = 3.3
  const maxVoltage = 4.2
  const normalized = (voltage - minVoltage) / (maxVoltage - minVoltage)
  return Math.round(clamp(normalized * 100, 0, 100))
}

function getReadingSignalBias(status: NodeStatus): number {
  if (status === "offline") {
    return -16
  }
  if (status === "warning") {
    return -8
  }
  return 0
}

function hopCountForType(type: NodeType): number {
  if (type === "gateway") {
    return 0
  }
  if (type === "relay") {
    return Math.min(3, Math.round(randomInRange(1, 2)))
  }
  return Math.min(3, Math.round(randomInRange(1, 3)))
}

function jitterCoordinate(value: number, maxOffset: number): number {
  return round(value + randomInRange(-maxOffset, maxOffset), 7)
}

function driftScalar(
  current: number | null,
  min: number,
  max: number,
  maxDelta: number,
  decimals: number
): number {
  const base = current ?? randomInRange(min, max)
  const next = base + randomInRange(-maxDelta, maxDelta)
  return round(clamp(next, min, max), decimals)
}

interface NodeContext {
  row: NodeRow
  gatewayExternalId: number | null
  lat: number
  lng: number
}

async function loadNodeContexts(
  supabase: SupabaseClient
): Promise<NodeContext[]> {
  const { data: nodeRows, error: nodesError } = await supabase
    .from("nodes")
    .select("*")
    .returns<NodeRow[]>()

  assertNoError("Load nodes", nodesError)
  if (!nodeRows?.length) {
    return []
  }

  const byId = new Map(nodeRows.map((row) => [row.id, row]))

  return nodeRows.map((row) => {
    const parent = row.gateway_id ? byId.get(row.gateway_id) : undefined
    return {
      row,
      gatewayExternalId: parent ? parent.external_id : null,
      lat: row.lat ?? 69.65,
      lng: row.lng ?? 19.0,
    }
  })
}

async function loadLatestReadingsByNodeId(
  supabase: SupabaseClient
): Promise<Map<string, ReadingRow>> {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .order("node_id", { ascending: true })
    .order("timestamp", { ascending: false })
    .returns<ReadingRow[]>()

  assertNoError("Load readings", error)

  const map = new Map<string, ReadingRow>()
  for (const row of data ?? []) {
    if (!map.has(row.node_id)) {
      map.set(row.node_id, row)
    }
  }
  return map
}

function buildRow(
  ctx: NodeContext,
  previous: ReadingRow | undefined,
  timestamp: string
): Record<string, unknown> {
  const { row } = ctx
  const signalBias = getReadingSignalBias(row.status)

  const temperature = driftScalar(
    previous?.temperature ?? null,
    -8,
    18,
    0.85,
    2
  )
  const humidity = driftScalar(previous?.humidity ?? null, 38, 92, 2.5, 2)
  const pressure = driftScalar(previous?.pressure ?? null, 978, 1025, 1.2, 2)

  const rssi = Math.round(
    clamp(
      (previous?.rssi ?? randomInRange(-105, -85)) +
        randomInRange(-4, 4) +
        signalBias,
      -120,
      -75
    )
  )
  const snr = round(
    clamp(
      (previous?.snr ?? randomInRange(0, 9)) +
        randomInRange(-1.5, 1.5) +
        signalBias / 4,
      -5,
      12
    ),
    2
  )
  const spreadingFactor = Math.round(
    clamp(
      (previous?.spreading_factor ?? randomInRange(7, 12)) +
        randomInRange(-1, 1),
      7,
      12
    )
  )

  let batteryVoltage = previous?.battery_voltage ?? randomInRange(3.55, 4.15)
  batteryVoltage = round(
    clamp(batteryVoltage + randomInRange(-0.012, 0.008), 3.3, 4.2),
    3
  )
  if (row.status === "warning") {
    batteryVoltage = round(
      clamp(batteryVoltage - randomInRange(0, 0.004), 3.35, 3.75),
      3
    )
  } else if (row.status === "offline") {
    batteryVoltage = round(
      clamp(batteryVoltage - randomInRange(0, 0.003), 3.3, 3.6),
      3
    )
  }

  const batteryPct = deriveBatteryPct(batteryVoltage)
  const hopCount = previous?.hop_count ?? hopCountForType(row.type)
  const seqNum =
    previous?.seq_num != null ? previous.seq_num + 1 : row.external_id * 10_000

  const rawPayload = {
    node: {
      id: row.external_id,
      name: row.name,
      type: row.type,
      firmware_ver: row.firmware_ver,
      hardware_ver: row.hardware_ver,
    },
    gateway_id: ctx.gatewayExternalId,
    timestamp,
    sensors: {
      temperature,
      humidity,
      pressure,
    },
    radio: {
      rssi,
      snr,
      spreading_factor: spreadingFactor,
    },
    power: {
      battery_voltage: batteryVoltage,
      battery_pct: batteryPct,
    },
    network: {
      hop_count: hopCount,
      seq_num: seqNum,
    },
    location: {
      lat: jitterCoordinate(ctx.lat, 0.002),
      lng: jitterCoordinate(ctx.lng, 0.002),
    },
  }

  return {
    node_id: row.id,
    timestamp,
    temperature,
    humidity,
    pressure,
    rssi,
    snr,
    spreading_factor: spreadingFactor,
    battery_voltage: batteryVoltage,
    battery_pct: batteryPct,
    hop_count: hopCount,
    seq_num: seqNum,
    raw_payload: rawPayload,
  }
}

async function runTick(
  supabase: SupabaseClient,
  contexts: NodeContext[],
  latestByNode: Map<string, ReadingRow>
): Promise<void> {
  const timestamp = new Date().toISOString()
  const rows: Record<string, unknown>[] = []

  for (const ctx of contexts) {
    const previous = latestByNode.get(ctx.row.id)
    const row = buildRow(ctx, previous, timestamp)
    rows.push(row)
    latestByNode.set(ctx.row.id, {
      id: "pending",
      node_id: ctx.row.id,
      timestamp,
      temperature: row.temperature as number,
      humidity: row.humidity as number,
      pressure: row.pressure as number,
      rssi: row.rssi as number,
      snr: row.snr as number,
      spreading_factor: row.spreading_factor as number,
      battery_voltage: row.battery_voltage as number,
      battery_pct: row.battery_pct as number,
      hop_count: row.hop_count as number,
      seq_num: row.seq_num as number,
      raw_payload: row.raw_payload as Record<string, unknown>,
    })
  }

  const { error } = await supabase.from("readings").insert(rows)
  assertNoError("Insert readings batch", error)
}

async function main(): Promise<void> {
  loadLocalEnvFallback()
  const { url, key } = getSupabaseCredentials()
  const supabase = createClient(url, key)

  const intervalMs = Number(process.env.SIMULATOR_INTERVAL_MS ?? 5000)
  if (!Number.isFinite(intervalMs) || intervalMs < 250) {
    throw new Error(
      "SIMULATOR_INTERVAL_MS must be a number ≥ 250 (default 5000)."
    )
  }

  writeProgress(
    `Telemetry simulator starting (${intervalMs}ms interval). Targets: all rows in nodes.`
  )

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    writeProgress(
      "Note: SUPABASE_SERVICE_ROLE_KEY is unset — if you see RLS errors on insert, add the service_role key to .env.local (see script header)."
    )
  }

  const contexts = await loadNodeContexts(supabase)
  if (contexts.length === 0) {
    writeProgress("No nodes found; run npm run seed first.")
    process.exit(0)
  }

  const latestByNode = await loadLatestReadingsByNodeId(supabase)

  const tick = async () => {
    try {
      await runTick(supabase, contexts, latestByNode)
      writeProgress(
        `[${new Date().toISOString()}] Inserted ${contexts.length} reading(s).`
      )
    } catch (err) {
      if (err instanceof Error) {
        process.stderr.write(`Tick failed: ${err.message}\n`)
        if (isRlsViolationMessage(err.message)) {
          writeRlsHintOnce()
        }
      } else {
        process.stderr.write("Tick failed with an unknown error.\n")
      }
    }
  }

  await tick()

  const handle = setInterval(() => {
    void tick()
  }, intervalMs)

  const shutdown = () => {
    clearInterval(handle)
    writeProgress("Simulator stopped.")
    process.exit(0)
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    process.stderr.write(`Simulator failed: ${error.message}\n`)
  } else {
    process.stderr.write("Simulator failed with an unknown error.\n")
  }
  process.exit(1)
})
