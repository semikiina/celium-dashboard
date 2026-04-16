'use client';

/**
 * DashboardShell
 * Wraps the app with TooltipProvider and SidebarProvider, renders AppSidebar
 * and SidebarInset for main content. Exposes a mobile header with SidebarTrigger.
 * Map route uses a flex column so the Leaflet view can fill the viewport.
 * @prop initialSidebarOpen — Hydration-safe default from the `sidebar_state` cookie (set in root layout).
 */

import { usePathname } from 'next/navigation';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AppSidebar } from '@/components/dashboard/layout/AppSidebar';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  children: React.ReactNode;
  /** Desktop sidebar default; should match the persisted cookie from the server. */
  initialSidebarOpen?: boolean;
}

export function DashboardShell({
  children,
  initialSidebarOpen = true,
}: DashboardShellProps) {
  const pathname = usePathname();
  const isMap = pathname === '/map';

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={initialSidebarOpen}>
        <AppSidebar />
        <SidebarInset
          className={cn(
            'bg-background min-h-0 flex-1',
            isMap
              ? 'flex flex-col overflow-hidden p-0'
              : 'overflow-y-auto'
          )}
        >
          <header className="border-border flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger className="text-foreground" />
            <span className="font-heading text-foreground text-lg font-semibold">
              Celium
            </span>
          </header>
          {isMap ? (
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          ) : (
            children
          )}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
