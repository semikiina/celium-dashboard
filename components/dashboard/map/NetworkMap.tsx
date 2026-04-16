'use client';

/**
 * NetworkMap
 * Renders the interactive Leaflet map for the `/map` page.
 * Plots nodes with valid coordinates; hover shows a tooltip, click routes to `/nodes/[id]`.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LatLngBounds } from 'leaflet';
import { Battery, ChevronLeft, ChevronRight, Clock, MapPin, Signal } from 'lucide-react';
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import { useSidebar } from '@/components/ui/sidebar';
import { NodeStatusBadge } from '@/components/dashboard/nodes/NodeStatusBadge';
import { useNodes } from '@/hooks/useNodes';
import {
  MAP_NODE_MARKER_LEAFLET,
  NODE_TYPE_DISPLAY,
} from '@/lib/constants';
import { formatCoordinates } from '@/lib/utils';
import type { NodeStatus, NodeType } from '@/types';

interface MappableNode {
  id: string;
  name: string;
  status: NodeStatus;
  type: NodeType;
  lat: number;
  lng: number;
  batteryPct: number | null;
  rssi: number | null;
  lastSeenAt: string | null;
}

interface ClusteredMarker {
  key: string;
  lat: number;
  lng: number;
  count: number;
  nodes: MappableNode[];
}

const DEFAULT_CENTER: [number, number] = [69.6492, 18.9553];
const SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_TILE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapViewportEventsProps {
  onBoundsChange: (bounds: MapBounds) => void;
  onZoomChange: (zoom: number) => void;
}

interface MapHoverFocusProps {
  targetNode: MappableNode | null;
}

function toMapBounds(bounds: LatLngBounds): MapBounds {
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
  };
}

function areBoundsEqual(a: MapBounds | null, b: MapBounds | null): boolean {
  if (!a || !b) return false;
  const EPSILON = 0.000001;
  return (
    Math.abs(a.north - b.north) < EPSILON &&
    Math.abs(a.south - b.south) < EPSILON &&
    Math.abs(a.east - b.east) < EPSILON &&
    Math.abs(a.west - b.west) < EPSILON
  );
}

function isNodeInsideBounds(node: MappableNode, bounds: MapBounds): boolean {
  return (
    node.lat <= bounds.north &&
    node.lat >= bounds.south &&
    node.lng <= bounds.east &&
    node.lng >= bounds.west
  );
}

function getClusterRadiusKm(zoom: number): number {
  // Keep markers fully individual until zoom 9,
  // then aggregate more aggressively once clustering starts.
  if (zoom > 9) return 0;
  if (zoom <= 4) return 120;
  if (zoom <= 6) return 60;
  if (zoom <= 8) return 25;
  if (zoom <= 9) return 12;
  return 0;
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function clusterNodes(nodes: MappableNode[], zoom: number): ClusteredMarker[] {
  const radiusKm = getClusterRadiusKm(zoom);
  if (radiusKm === 0) {
    return nodes.map((node) => ({
      key: node.id,
      lat: node.lat,
      lng: node.lng,
      count: 1,
      nodes: [node],
    }));
  }

  // Start from single-node clusters, then iteratively merge close clusters.
  let clusters: ClusteredMarker[] = nodes.map((node) => ({
    key: node.id,
    lat: node.lat,
    lng: node.lng,
    count: 1,
    nodes: [node],
  }));

  let merged = true;
  while (merged) {
    merged = false;
    const nextClusters: ClusteredMarker[] = [];
    const consumed = new Set<number>();

    for (let i = 0; i < clusters.length; i += 1) {
      if (consumed.has(i)) continue;
      const base = clusters[i];
      let aggregateNodes = [...base.nodes];
      let aggregateLat = base.lat * base.count;
      let aggregateLng = base.lng * base.count;
      let aggregateCount = base.count;

      for (let j = i + 1; j < clusters.length; j += 1) {
        if (consumed.has(j)) continue;
        const candidate = clusters[j];
        const d = distanceKm(base.lat, base.lng, candidate.lat, candidate.lng);
        if (d <= radiusKm) {
          consumed.add(j);
          merged = true;
          aggregateNodes = aggregateNodes.concat(candidate.nodes);
          aggregateLat += candidate.lat * candidate.count;
          aggregateLng += candidate.lng * candidate.count;
          aggregateCount += candidate.count;
        }
      }

      nextClusters.push({
        key: aggregateNodes.map((n) => n.id).sort().join(':'),
        lat: aggregateLat / aggregateCount,
        lng: aggregateLng / aggregateCount,
        count: aggregateCount,
        nodes: aggregateNodes,
      });
    }

    clusters = nextClusters;
  }

  return clusters;
}

/**
 * Recomputes map size when the sidebar toggles or mobile sheet opens.
 */
function MapInvalidateOnLayout() {
  const map = useMap();
  const { state, openMobile } = useSidebar();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      map.invalidateSize();
    });
    return () => cancelAnimationFrame(id);
  }, [map, state, openMobile]);

  return null;
}

/**
 * Emits viewport bounds when map renders and after move/zoom.
 */
function MapViewportEvents({ onBoundsChange, onZoomChange }: MapViewportEventsProps) {
  const map = useMap();

  useEffect(() => {
    onBoundsChange(toMapBounds(map.getBounds()));
    onZoomChange(map.getZoom());
  }, [map, onBoundsChange, onZoomChange]);

  useMapEvents({
    moveend: () => onBoundsChange(toMapBounds(map.getBounds())),
    zoomend: () => {
      onBoundsChange(toMapBounds(map.getBounds()));
      onZoomChange(map.getZoom());
    },
  });

  return null;
}

/**
 * Smoothly focuses the map on a hovered carousel node.
 */
function MapHoverFocus({ targetNode }: MapHoverFocusProps) {
  const map = useMap();

  useEffect(() => {
    if (!targetNode) return;
    const focusZoom = Math.max(map.getZoom(), 13);
    map.flyTo([targetNode.lat, targetNode.lng], focusZoom, {
      duration: 0.35,
      easeLinearity: 0.25,
    });
  }, [map, targetNode]);

  return null;
}

function formatLastSeen(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return '—';
  }
}

function MapNodeMetrics({ node, stacked = false }: { node: MappableNode; stacked?: boolean }) {
  return (
    <div className={stacked ? 'flex flex-col gap-1.5 pt-1' : 'grid grid-cols-2 gap-2 pt-1'}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Battery className="size-3.5 shrink-0" aria-hidden />
        <span className="font-body text-[11px]">
          {node.batteryPct !== null ? `${Math.round(node.batteryPct)}%` : '—'}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Signal className="size-3.5 shrink-0" aria-hidden />
        <span className="font-body text-[11px]">
          {node.rssi !== null ? `${node.rssi} dBm` : '—'}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        <span className="font-body text-[11px]">{formatCoordinates(node.lat, node.lng)}</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="size-3.5 shrink-0" aria-hidden />
        <span className="font-body text-[11px]">{formatLastSeen(node.lastSeenAt)}</span>
      </div>
    </div>
  );
}

/**
 * NetworkMap component body.
 */
export function NetworkMap() {
  const router = useRouter();
  const { nodes, isLoading, error } = useNodes();
  const [appliedBounds, setAppliedBounds] = useState<MapBounds | null>(null);
  const [pendingBounds, setPendingBounds] = useState<MapBounds | null>(null);
  const [mapZoom, setMapZoom] = useState(11);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const mapNodes = useMemo<MappableNode[]>(() => {
    return nodes
      .filter((node) => node.lat !== null && node.lng !== null)
      .map((node) => ({
        id: node.id,
        name: node.name,
        status: node.status,
        type: node.type,
        lat: node.lat as number,
        lng: node.lng as number,
        batteryPct:
          node.latestReading?.batteryPct ?? node.batteryPct ?? null,
        rssi: node.latestReading?.rssi ?? null,
        lastSeenAt: node.lastSeenAt,
      }));
  }, [nodes]);

  const center = useMemo<[number, number]>(() => {
    if (mapNodes.length === 0) return DEFAULT_CENTER;
    const latAvg =
      mapNodes.reduce((sum, node) => sum + node.lat, 0) / mapNodes.length;
    const lngAvg =
      mapNodes.reduce((sum, node) => sum + node.lng, 0) / mapNodes.length;
    return [latAvg, lngAvg];
  }, [mapNodes]);

  const visibleNodes = useMemo(() => {
    if (!appliedBounds) return mapNodes;
    return mapNodes.filter((node) => isNodeInsideBounds(node, appliedBounds));
  }, [appliedBounds, mapNodes]);

  const clusteredMarkers = useMemo(() => clusterNodes(mapNodes, mapZoom), [mapNodes, mapZoom]);
  const hoveredNode = useMemo(
    () => mapNodes.find((node) => node.id === hoveredNodeId) ?? null,
    [mapNodes, hoveredNodeId]
  );

  const hasPendingViewport =
    pendingBounds !== null &&
    appliedBounds !== null &&
    !areBoundsEqual(pendingBounds, appliedBounds);

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setPendingBounds((prev) => (areBoundsEqual(prev, bounds) ? prev : bounds));
    setAppliedBounds((prev) => prev ?? bounds);
  }, []);

  const updateCarouselArrows = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const EPSILON = 2;
    setCanScrollLeft(el.scrollLeft > EPSILON);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - EPSILON);
  }, []);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const delta = Math.max(220, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: direction === 'left' ? -delta : delta, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    updateCarouselArrows();
  }, [visibleNodes, updateCarouselArrows]);

  if (error) {
    return (
      <div className="bg-card border-border flex min-h-0 flex-1 items-center justify-center border">
        <p className="font-body text-muted-foreground text-sm">
          Failed to load map nodes. Please try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-muted min-h-0 flex-1 animate-pulse" aria-hidden />
    );
  }

  return (
    <div className="bg-card border-border flex min-h-0 flex-1 flex-col overflow-hidden border">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        className="z-0 min-h-0 flex-1"
      >
        <MapInvalidateOnLayout />
        <MapViewportEvents onBoundsChange={handleBoundsChange} onZoomChange={setMapZoom} />
        <MapHoverFocus targetNode={hoveredNode} />
        <TileLayer attribution={SATELLITE_TILE_ATTRIBUTION} url={SATELLITE_TILE_URL} />

        {clusteredMarkers.map((cluster) => {
          if (cluster.count === 1) {
            const node = cluster.nodes[0];
            const leaflet = MAP_NODE_MARKER_LEAFLET[node.status];
            const isHighlighted = hoveredNodeId === node.id;

            return (
              <CircleMarker
                key={node.id}
                center={[node.lat, node.lng]}
                radius={isHighlighted ? 11 : 8}
                pathOptions={{
                  color: isHighlighted ? '#ffffff' : leaflet.stroke,
                  fillColor: leaflet.fill,
                  fillOpacity: isHighlighted ? 1 : 0.9,
                  weight: isHighlighted ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => router.push(`/nodes/${node.id}`),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -6]}
                  opacity={1}
                  className="!rounded-lg !border !border-border !bg-card !px-3 !py-2 !text-foreground !shadow-md"
                >
                  <div className="font-body max-w-[16rem] space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-foreground font-semibold">{node.name}</p>
                      <NodeStatusBadge status={node.status} />
                    </div>
                    <p className="text-muted-foreground">{NODE_TYPE_DISPLAY[node.type]}</p>
                    <MapNodeMetrics node={node} stacked />
                    <p className="text-muted-foreground text-[10px]">
                      Click marker for node page
                    </p>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          }

          return (
            <CircleMarker
              key={cluster.key}
              center={[cluster.lat, cluster.lng]}
              radius={Math.min(22, 10 + cluster.count)}
              pathOptions={{
                color: '#1784E3',
                fillColor: '#1784E3',
                fillOpacity: 0.75,
                weight: 2,
              }}
              eventHandlers={{
                click: (event) => {
                  const map = event.target._map;
                  if (map) {
                    map.setView([cluster.lat, cluster.lng], Math.min(mapZoom + 2, 18));
                  }
                },
              }}
            >
              <Tooltip
                direction="center"
                offset={[0, 0]}
                opacity={1}
                permanent
                className="!border-0 !bg-transparent !p-0 !text-white !shadow-none"
              >
                <span className="font-body text-xs font-semibold">{cluster.count}</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500]">
        <div className="flex justify-center pb-3">
          {hasPendingViewport && (
            <button
              type="button"
              onClick={() => setAppliedBounds(pendingBounds)}
              className="pointer-events-auto font-body rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-sidebar-accent"
            >
              Search this area
            </button>
          )}
        </div>
        <div className="relative px-3 pb-3">
          <button
            type="button"
            onClick={() => scrollCarousel('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll visible nodes left"
            className="pointer-events-auto absolute left-4 top-1/2 z-[510] -translate-y-1/2 rounded-full border border-border bg-card/95 p-1.5 text-foreground shadow-md transition-colors enabled:hover:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel('right')}
            disabled={!canScrollRight}
            aria-label="Scroll visible nodes right"
            className="pointer-events-auto absolute right-4 top-1/2 z-[510] -translate-y-1/2 rounded-full border border-border bg-card/95 p-1.5 text-foreground shadow-md transition-colors enabled:hover:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <div
            ref={carouselRef}
            onScroll={updateCarouselArrows}
            className="pointer-events-auto overflow-x-auto px-10"
          >
            <div className="flex min-w-full w-max justify-center gap-3">
              {visibleNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => router.push(`/nodes/${node.id}`)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId((prev) => (prev === node.id ? null : prev))}
                  className="bg-card border-border min-w-[17rem] max-w-[17rem] shrink-0 rounded-lg border px-3 py-2 text-left shadow-md transition-colors hover:bg-sidebar-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-body text-sm font-semibold text-foreground">{node.name}</p>
                    <NodeStatusBadge status={node.status} />
                  </div>
                  <p className="font-body pt-1 text-xs text-muted-foreground">
                    {NODE_TYPE_DISPLAY[node.type]}
                  </p>
                  <MapNodeMetrics node={node} />
                </button>
              ))}
              {visibleNodes.length === 0 && (
                <div className="bg-card border-border min-w-full rounded-lg border px-3 py-2">
                  <p className="font-body text-xs text-muted-foreground">
                    No nodes found in this area.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
