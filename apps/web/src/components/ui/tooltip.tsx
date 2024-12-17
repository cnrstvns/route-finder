'use client';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

type TooltipProps = {
  trigger: ReactNode;
  children: ReactNode;
};

const Tooltip = ({ trigger, children }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 w-max-content relative whitespace-normal text-white rounded-md shadow bg-black px-2 py-1.5 text-xs"
            side="bottom"
          >
            {children}
            <TooltipPrimitive.Arrow className="fill-black" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
