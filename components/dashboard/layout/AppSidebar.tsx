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
  Cpu,
  LayoutDashboard,
  Map,
  type LucideIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/dashboard/layout/ThemeToggle';
import { cn } from '@/lib/utils';

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

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-border border-r"
    >
      <SidebarHeader className="border-border gap-0 border-b px-4 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/logo-square.svg"
            alt="Celium"
            width={48}
            height={48}
            className="rounded-md"
            priority
          />
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-2xl font-extrabold leading-6 text-sidebar-foreground">
              CELIUM
            </span>
            <span className="font-body text-[10px] leading-[10px] text-primary">
              Celium Network Monitor
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 pt-4">
        <SidebarMenu className="gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  size="lg"
                  tooltip={item.label}
                  className={cn(
                    'font-body text-base font-medium',
                    !isActive &&
                      'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive &&
                      '!bg-primary !text-primary-foreground shadow-md hover:!bg-primary hover:!text-primary-foreground'
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-border flex flex-col gap-2 border-t px-2 py-4">
        <ThemeToggle />
        <div className="flex flex-col gap-1 rounded-[10px] border border-border bg-sidebar-accent px-4 py-3 group-data-[collapsible=icon]:hidden">
          <span className="font-body text-xs text-muted-foreground">Network Status</span>
          <span className="font-body text-sm font-medium text-sidebar-primary">
            Online • 99.2% Uptime
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
