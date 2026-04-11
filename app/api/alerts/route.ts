/**
 * GET /api/alerts
 * Returns alerts ordered by creation date (newest first).
 * Supports an optional `resolved` query parameter to filter:
 *   ?resolved=false  → only unresolved alerts
 *   ?resolved=true   → only resolved alerts
 *   (omitted)        → all alerts
 */

import { createClient } from "@/lib/supabase"
import { Alert, AlertRow } from "@/types"
import { NextRequest, NextResponse } from "next/server"

function mapRowToAlert(row: AlertRow): Alert {
  return {
    id: row.id,
    nodeId: row.node_id,
    severity: row.severity,
    type: row.type,
    message: row.message,
    resolved: row.resolved,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = request.nextUrl
  const resolvedParam = searchParams.get("resolved")

  let query = supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })

  if (resolvedParam === "true") {
    query = query.eq("resolved", true)
  } else if (resolvedParam === "false") {
    query = query.eq("resolved", false)
  }

  const { data, error } = await query.returns<AlertRow[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data ?? []).map(mapRowToAlert))
}
