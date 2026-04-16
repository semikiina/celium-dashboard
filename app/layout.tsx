/**
 * RootLayout
 * Provides the global application shell with persistent sidebar and content area.
 * Reads `SIDEBAR_STATE_COOKIE_NAME` so the sidebar open state matches on first paint (hydration-safe).
 * @prop children - The page content rendered inside the main panel.
 */

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { DashboardShell } from '@/components/dashboard/layout/DashboardShell';
import { ThemeProvider } from '@/components/dashboard/layout/ThemeProvider';
import { SIDEBAR_STATE_COOKIE_NAME } from '@/lib/constants';
import 'leaflet/dist/leaflet.css';
import './globals.css';

/** Inter only — use `--font-inter` (not `--font-sans`) so Tailwind’s default `--font-sans` theme token does not shadow Next.js. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Celium Dashboard',
  description: 'Monitor Celium network health, telemetry, map coverage, and alerts.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const themeInitScript = `(function(){try{var k='celium-theme';var t=localStorage.getItem(k);var d=document.documentElement;if(t==='light'){d.classList.remove('dark');}else{d.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SIDEBAR_STATE_COOKIE_NAME)?.value;
  const initialSidebarOpen =
    raw === 'false' ? false : raw === 'true' ? true : true;

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body
        className={`${inter.className} bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Script
          id="celium-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ThemeProvider>
          <DashboardShell initialSidebarOpen={initialSidebarOpen}>
            {children}
          </DashboardShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
