'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        'scrollbar-hide sticky top-[calc(var(--navbar-height)+16px)] left-0 z-50 w-full justify-between overflow-x-auto bg-neutral-900 p-1 backdrop-blur-sm',
        props.className
      )}
    />
  );
}
