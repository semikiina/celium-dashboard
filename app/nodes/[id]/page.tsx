/**
 * NodeDetailPage
 * Screen 5 — Per-node detail page with current readings, metadata, and
 * historical sensor charts. Reached by clicking a node row on the Nodes page.
 * Renders a server-side shell and delegates interactive content to
 * NodeDetailContent.
 */

import { NodeDetailContent } from '@/components/dashboard/node_detail/NodeDetailContent';

interface NodeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NodeDetailPage({ params }: NodeDetailPageProps) {
  const { id } = await params;

  return <NodeDetailContent nodeId={id} />;
}
