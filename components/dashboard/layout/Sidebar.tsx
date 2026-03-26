'use client';

/**
 * Sidebar
 * Renders the persistent dashboard navigation with brand logo and route links.
 * @prop none - This component does not accept props.
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

import { cn } from '@/lib/utils';

interface SidebarProps {}

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Nodes', href: '/nodes', icon: Cpu },
  { label: 'Map', href: '/map', icon: Map },
  { label: 'Explorer', href: '/explorer', icon: BarChart2 },
  { label: 'Alerts', href: '/alerts', icon: Bell },
];

export function Sidebar({}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 shrink-0 border-r border-zinc-700 bg-zinc-900">
      <div className="border-b border-zinc-700 p-5">
        <Link href="/" className="inline-flex align-middle">
          <Image src="/logos/logo-square.svg" alt="Celium Dashboard" width={140} height={140} priority />
        </Link>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100',
                    isActive && 'bg-zinc-800 text-brand-blue'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-body font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
