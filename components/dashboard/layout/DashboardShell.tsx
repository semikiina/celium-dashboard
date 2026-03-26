'use client';

/**
 * DashboardShell
 * Wraps the app with TooltipProvider and SidebarProvider, renders AppSidebar
 * and SidebarInset for main content. Exposes a mobile header with SidebarTrigger.
 */

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AppSidebar } from '@/components/dashboard/layout/AppSidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background min-h-0 flex-1 overflow-y-auto">
          <header className="border-border flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger className="text-foreground" />
            <span className="font-heading text-foreground text-lg font-semibold">
              Celium
            </span>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
