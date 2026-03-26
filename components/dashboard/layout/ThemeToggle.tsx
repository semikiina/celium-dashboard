'use client';

/**
 * ThemeToggle
 * Sidebar row with a shadcn Switch to toggle between light and dark mode.
 */

import { Switch } from '@/components/ui/switch';

import { useTheme } from '@/components/dashboard/layout/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1.5">
      <span className="font-body text-sm text-muted-foreground">Dark mode</span>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Enable dark mode"
        className="shrink-0"
      />
    </div>
  );
}
