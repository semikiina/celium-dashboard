'use client';

/**
 * MapPage
 * Screen 3 — Map. Renders the interactive Leaflet map with clickable node markers.
 */

import dynamic from 'next/dynamic';

const NetworkMap = dynamic(
  () => import('@/components/dashboard/map/NetworkMap').then((m) => m.NetworkMap),
  { ssr: false },
);

export default function MapPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NetworkMap />
    </div>
  );
}
