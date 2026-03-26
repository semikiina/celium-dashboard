'use client';

/**
 * Sidebar
 * Renders the persistent dashboard navigation with brand logo, route links,
 * and a network status footer. Matches the Figma design with gradient active
 * state, blue-tinted borders, and brand-navy background.
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-brand-blue/20 bg-brand-navy">
      {/* Logo */}
      <div className="border-b border-brand-blue/20 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/logo-square.svg"
            alt="Celium"
            width={48}
            height={48}
            className="rounded-md"
            priority
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-2xl font-extrabold leading-6 text-white">
              CELIUM
            </span>
            <span className="font-body text-[10px] leading-[10px] text-brand-cyan">
              ArcLoRaM Network Monitor
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4">
        <ul className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-12 items-center gap-3 rounded-[10px] pl-4 transition-colors',
                    isActive
                      ? 'bg-brand-gradient text-white shadow-[0_10px_15px_0_rgba(23,132,227,0.3),0_4px_6px_0_rgba(23,132,227,0.3)]'
                      : 'text-zinc-400 hover:bg-brand-blue/10 hover:text-zinc-200'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-body text-base font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Network Status Footer */}
      <div className="border-t border-brand-blue/20 px-4 py-4">
        <div className="flex flex-col gap-1 rounded-[10px] border border-brand-blue/30 bg-brand-blue/10 px-4 py-3">
          <span className="font-body text-xs text-zinc-400">
            Network Status
          </span>
          <span className="font-body text-sm font-medium text-brand-cyan">
            Online • 99.2% Uptime
          </span>
        </div>
      </div>
    </aside>
  );
}
