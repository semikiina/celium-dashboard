'use client';

/**
 * ThemeToggle
 * Sidebar row with a shadcn Switch to toggle between light and dark mode.
 * In icon-collapsed sidebar, shows only the switch with a tooltip label.
 */

import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';

import { useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/components/dashboard/layout/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { state, isMobile } = useSidebar();
  const iconOnly = state === 'collapsed' && !isMobile;

  const switchControl = (
    <Switch
      checked={theme === 'dark'}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      aria-label="Enable dark mode"
      className="h-6 w-11 shrink-0"
      thumbClassName="size-5"
      thumbChildren={
        theme === 'dark' ? (
          <Moon className="size-3 text-sky-700 dark:text-sky-200" aria-hidden />
        ) : (
          <Sun className="size-3 text-amber-500" aria-hidden />
        )
      }
    />
  );

  return (
    <div
      className={cn(
        'flex items-center',
        iconOnly ? 'justify-center px-0 pt-2 pb-3' : 'justify-between gap-2 px-2 pt-1.5 pb-2.5'
      )}
    >
      {!iconOnly && (
        <span className="font-body text-sm text-muted-foreground">Dark mode</span>
      )}
      {iconOnly ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center">{switchControl}</span>
          </TooltipTrigger>
          <TooltipContent side="right">Dark mode</TooltipContent>
        </Tooltip>
      ) : (
        switchControl
      )}
    </div>
  );
}
