/**
 * RootLayout
 * Provides the global application shell with persistent sidebar and content area.
 * @prop children - The page content rendered inside the main panel.
 */

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';

import { Sidebar } from '@/components/dashboard/layout/Sidebar';
import '@/styles/globals.css';

const headingFont = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
});

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Celium Dashboard',
  description: 'Monitor Celium network health, telemetry, map coverage, and alerts.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="bg-brand-navy text-zinc-100" suppressHydrationWarning>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
