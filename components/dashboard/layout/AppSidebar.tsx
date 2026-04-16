'use client';

/**
 * AppSidebar
 * Dashboard navigation using shadcn Sidebar: logo, main route links with active
 * gradient state, network status footer, and rail toggle (desktop).
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Cpu,
  LayoutDashboard,
  Map,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/dashboard/layout/ThemeToggle';
import { cn } from '@/lib/utils';

/**
 * Returns true when the nav item for `href` should show the active (selected) style.
 */
function isNavigationActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === '/nodes') return pathname.startsWith('/nodes/');
  return false;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Nodes', href: '/nodes', icon: Cpu },
  { label: 'Map', href: '/map', icon: Map },
  { label: 'Data Explorer', href: '/explorer', icon: BarChart2 },
  { label: 'Alerts', href: '/alerts', icon: Bell },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();
  /** Desktop icon rail hides labels; mobile sheet always shows labels. */
  const labelsVisible = isMobile || state === 'expanded';

  return (
    <Sidebar
      collapsible="icon"
      className="border-border border-r"
    >
      <SidebarHeader
        className="border-border gap-0 border-b px-2 py-3"
      >
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 transition-all duration-300 ease-in-out',
            !labelsVisible && 'w-full justify-center gap-0 p-0'
          )}
        >
          <Image
            src="/logos/logo-square.svg"
            alt="Celium"
            width={48}
            height={48}
            className="size-10 rounded-md shrink-0"
            priority
          />
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              labelsVisible
                ? 'max-w-[10rem] translate-x-0 opacity-100'
                : 'pointer-events-none max-w-0 translate-x-1 opacity-0'
            )}
          >
            <div className="flex min-w-max flex-col gap-0.5">
              <span className="font-heading text-2xl font-extrabold leading-6 text-sidebar-foreground">
                CELIUM
              </span>
              <span className="font-body text-[10px] leading-[10px] text-primary">
                Celium Network Monitor
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-3 pt-4">
        <div className={cn('mb-2', !labelsVisible && 'flex justify-center')}>
          <Button
            type="button"
            variant="ghost"
            size={labelsVisible ? 'sm' : 'icon-sm'}
            onClick={toggleSidebar}
            aria-label={labelsVisible ? 'Collapse sidebar panel' : 'Expand sidebar panel'}
            title={labelsVisible ? 'Collapse sidebar panel' : 'Expand sidebar panel'}
            className={cn(
              'text-muted-foreground hover:text-foreground',
              labelsVisible
                ? 'h-9 w-full justify-start gap-2 border border-border/60 px-2.5'
                : 'h-9 w-9 justify-center gap-0 rounded-md border border-border/60'
            )}
          >
            {labelsVisible ? (
              <ChevronLeft className="size-4 shrink-0" aria-hidden />
            ) : (
              <ChevronRight className="size-4 shrink-0" aria-hidden />
            )}
            <span
              className={cn(
                'font-body text-xs font-medium overflow-hidden whitespace-nowrap transition-all duration-200 ease-out',
                labelsVisible
                  ? 'relative max-w-[8rem] translate-x-0 opacity-100'
                  : 'pointer-events-none absolute max-w-0 translate-x-1 opacity-0'
              )}
            >
              Collapse sidebar
            </span>
          </Button>
        </div>
        <SidebarMenu
          className={cn('gap-1.5', !labelsVisible && 'items-center gap-3')}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavigationActive(pathname, item.href);

            return (
              <SidebarMenuItem
                key={item.href}
                className={cn(!labelsVisible && 'flex w-full justify-center')}
              >
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  size="default"
                  tooltip={item.label}
                  className={cn(
                    'font-body text-sm font-medium h-10 gap-2 !px-3 !py-2 group-data-[collapsible=icon]:!px-3 group-data-[collapsible=icon]:!py-2 [&_svg]:!size-5',
                    !labelsVisible && '!mx-auto !h-10 !w-11 max-w-11 justify-center gap-0',
                    !isActive &&
                      'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive &&
                      '!bg-primary !text-primary-foreground shadow-md hover:!bg-primary hover:!text-primary-foreground'
                  )}
                >
                  <Link
                    href={item.href}
                    aria-label={labelsVisible ? undefined : item.label}
                    className={cn(!labelsVisible && 'flex h-full w-full items-center justify-center')}
                  >
                    <Icon className="shrink-0" aria-hidden />
                    <span
                      className={cn(
                        'overflow-hidden whitespace-nowrap transition-all duration-200 ease-out',
                        labelsVisible
                          ? 'relative max-w-[8rem] translate-x-0 opacity-100'
                          : 'pointer-events-none absolute max-w-0 translate-x-1 opacity-0'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          'border-border flex flex-col border-t px-2 py-1',
          !labelsVisible && 'items-center gap-1'
        )}
      >
        <ThemeToggle />
        {labelsVisible && (
          <div className="flex flex-col gap-1 rounded-[10px] border border-border bg-sidebar-accent px-4 py-3">
            <span className="font-body text-xs text-muted-foreground">Network Status</span>
            <span className="font-body text-sm font-medium text-sidebar-primary">
              Online • 99.2% Uptime
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
