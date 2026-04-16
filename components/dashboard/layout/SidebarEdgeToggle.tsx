'use client';

/**
 * SidebarEdgeToggle
 * Fixed control on the vertical line between sidebar and main, vertically centered
 * on the boundary between the header block and the nav list. Solid rounded-square
 * surface; rendered after SidebarInset so it stacks above the main panel.
 */

import { useLayoutEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

/** Horizontal offset used to center the compact edge toggle on the sidebar boundary. */
const EDGE_INSET = '1.100rem';

export function SidebarEdgeToggle() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [edgeTopPx, setEdgeTopPx] = useState<number | null>(null);

  const expanded = state === 'expanded';

  useLayoutEffect(() => {
    if (isMobile) return;

    const header = document.querySelector('[data-slot="sidebar-header"]');
    if (!header || !(header instanceof HTMLElement)) return;

    const update = () => {
      const r = header.getBoundingClientRect();
      setEdgeTopPx(r.bottom);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <Button
      type="button"
      variant="default"
      size="icon"
      onClick={toggleSidebar}
      aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      className={cn(
        'border-0 bg-primary text-primary-foreground',
        'fixed z-[60] rounded-md w-5 h-5 p-[3px]',
        'active:-translate-y-1/2',
        '-translate-y-1/2 transition-[left] duration-200 ease-linear',
        'hidden md:inline-flex'
      )}
      style={{
        left: expanded
          ? `calc(var(--sidebar-width) - ${EDGE_INSET})`
          : `calc(var(--sidebar-width-icon) - ${EDGE_INSET})`,
        top: 80,
      }}
    >
      {expanded ? (
        <ChevronLeft className="size-4 p-0" aria-hidden />
      ) : (
        <ChevronRight className="size-4 p-0" aria-hidden />
      )}
    </Button>
  );
}
