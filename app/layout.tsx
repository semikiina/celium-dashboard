/**
 * RootLayout
 * Provides the global application shell with persistent sidebar and content area.
 * @prop children - The page content rendered inside the main panel.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { DashboardShell } from '@/components/dashboard/layout/DashboardShell';
import { ThemeProvider } from '@/components/dashboard/layout/ThemeProvider';
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

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
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
          <DashboardShell>{children}</DashboardShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
