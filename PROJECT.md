# Celium Dashboard

## What Is This?

Celium Dashboard is the web-based monitoring interface for the **ArcLoRaM Kit** — an off-grid connectivity solution built on a custom LoRaWAN-based mesh protocol. It is designed to safeguard and add telemetry/agent tracking to vast areas in extreme regions (arctic, desert, jungle, forest). The dashboard visualises the state of a distributed network of hardware nodes deployed across large geographic areas (up to 310,000 km²).

This repository is the **MVP prototype**. It uses mocked data seeded into a real database to simulate what live network telemetry would look like. The architecture is designed so that swapping mocked data for a live ingestion pipeline requires minimal structural change.

---

## Project Goals

- Provide a real-time (or near-real-time) view of the ArcLoRaM node network
- Allow operators to drill into individual nodes and inspect sensor readings over time
- Track both static sensors and mobile personal distress beacons (tourists/field agents)
- Surface alerts and anomalies in the network
- Serve as a foundation for a production dashboard — not a throwaway prototype

---

## Core Network Concepts

Understanding these terms is essential for reading the codebase:

| Term | Code name | Meaning |
|---|---|---|
| **Gateway Node** | `C3` | The primary network anchor. Installed at high altitude (mast, hilltop, public facility). Provides network timing and internet uplink (satellite or fibre). Aggregates all data from the network and acts as the ultimate data recipient. Manages its own cluster of C1/C2 nodes. Quantity per kit: 1–3. |
| **Relay Node** | `C2` | Deployed along coverage corridors to extend range and ensure mesh continuity through terrain obstacles. Installed on a mast. Also manages a cluster of C1 end nodes. Can carry its own sensors. Supports energy harvesting (solar, wind). Quantity: determined by network simulator. |
| **End Node** | `C1` | The leaf node of the network. Primarily an interface module for sensors (landslide, permafrost, GNSS, vibration, etc.) or a personal distress beacon worn by a tourist or field operator. Includes configurable I/O ports and a compact MCU running the ArcLoRaM firmware stack. Can be static (fixed sensor installation) or mobile (worn device). Quantity: determined by network simulator. |
| **Cluster** | — | One C3 or C2 node + all C1 end nodes it directly manages. Forms a single "star". |
| **Mesh** | — | The full collection of clusters. C3 gateways and C2 relays interconnect at the upper layer, forming a mesh above the star clusters. |
| **Self-healing** | — | If a C3 or C2 goes offline, its C1 nodes re-associate with a neighbouring parent node automatically. |
| **Range** | — | Up to 15 km per node under line-of-sight conditions. |
| **Emergency mode** | — | A low-latency mode triggered by the C3. Overrides normal TDMA scheduling to prioritise distress beacon traffic. |
| **Static node** | — | A C1 fixed to a physical location (sensor pole, ground installation). |
| **Mobile node / beacon** | — | A C1 worn by a person. Supports real-time GNSS position tracking visible to both the operator and the wearer. |

---

## Key Features (MVP Scope)

1. **Network Overview** — top-level health summary: total nodes, active/inactive counts, alert count, network coverage indicator
2. **Node List** — filterable/sortable table of all nodes with status badges
3. **Map View** — geographic visualisation of node positions and cluster topology
4. **Data Explorer** — query sensor readings across nodes and time ranges
5. **Node Detail + Charts** — per-node page with historical sensor data charts
6. **Alerts Feed** — list of triggered alerts with severity, timestamp, and affected node

---

## ArcLoRaM Kit Components (for context)

The dashboard is one component of a larger commercial kit sold as a self-contained deployment unit:

| Component | Description | Price |
|---|---|---|
| Gateway Node (C3) | 1–3 per kit | 1,500 DKK each |
| Relay Node (C2) | Quantity TBD by simulator | 1,500 DKK each |
| End Node (C1) | Quantity TBD by simulator | 350 DKK each |
| **Dashboard Software** | **This repository — cloud hosted, monthly subscription** | **450 DKK/mo** |
| Deployment & Maintenance Kit | Mounting tools, installation guide, field calibration interface | As needed |
| ArcLoRaM Firmware | Three firmware variants (one per node class) covering LoRa driver, TDMA scheduler, routing logic, channel access, Sensor Integration Layer (SIL), caching, and deep sleep | Bundled |

---

## Branding

| Element | Value |
|---|---|
| **Primary blue** | `#1784E3` |
| **Dark navy** | `#121D2A` |
| **Accent cyan** | `#5DD4D8` |
| **Deep blue (CTA / hover)** | `#1E3A8A` (approx. from swatch) |
| **Gradient** | `#1784E3` → `#5DD4D8` (left to right, used on hero elements and active states) |
| **Heading font** | Poppins (bold/semi-bold) |
| **Body / UI font** | Inter (regular / medium) |
| **Logo assets** | `/public/logos/` — 6 SVG variants (see ARCHITECTURE.md for usage rules) |

The dark navy (`#121D2A`) doubles as the primary dark background, making the palette naturally suited to the dark-themed dashboard.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API routes in one repo |
| Language | TypeScript | Type safety across frontend and backend |
| Styling | Tailwind CSS | Utility-first, fast to build with |
| UI Components | shadcn/ui | Accessible, composable, unstyled base |
| Charts | Recharts | React-native, composable chart primitives |
| Map | react-leaflet | Free, OSM-based, no API key needed for MVP |
| Database | Supabase (Postgres) | Free tier, hosted, real Postgres, great DX |
| ORM / Query | Supabase JS client | No ORM overhead for MVP; raw SQL via RPC if needed |
| State / Fetching | SWR | Lightweight, built-in revalidation |
| Linting | ESLint + Prettier | Enforced via `.eslintrc` and `.prettierrc` |

---

## Mocked Data Strategy

For MVP, all data is **seeded mock data** stored in Supabase. The schema mirrors what real hardware would produce. When live hardware is available:

- Replace the seed script with a real ingestion endpoint (`/api/ingest`)
- The rest of the application reads from the same DB tables and requires no changes

---

## Repo Structure (high level)

```
celium-dashboard/
├── app/                  # Next.js App Router pages and API routes
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui base components (do not modify directly)
│   └── dashboard/        # Domain-specific composed components
├── lib/                  # Utility functions, Supabase client, type helpers
├── types/                # Global TypeScript types and interfaces
├── hooks/                # Custom React hooks (data fetching, UI state)
├── styles/               # Global CSS
├── scripts/              # DB seed scripts and one-off utilities
├── public/               # Static assets
├── PROJECT.md            # You are here
├── ARCHITECTURE.md       # System and code architecture decisions
└── .cursorrules          # AI agent coding conventions for this repo
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your Supabase project

# 3. Run DB migrations and seed mock data
npm run db:seed

# 4. Start the dev server
npm run dev
```

---

## Out of Scope for MVP

- User authentication / authorisation
- Live hardware ingestion
- Real-time WebSocket updates (polling is used instead)
- Multi-tenancy
- Mobile-responsive layout (desktop-first for MVP)