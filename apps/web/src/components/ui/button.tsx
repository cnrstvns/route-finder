import { cn } from '@/lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant: 'default' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'black';
  size: 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
  loading?: boolean;
  icon?: IconProp;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ children, className, variant, size, asChild = false, loading, icon, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(
					'inline-flex cursor-default items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
					{
						'h-8 rounded-md px-3': size === 'sm',
						'h-10 px-4 py-2': size === 'md',
						'h-11 rounded-md px-8': size === 'lg',
						'h-10 w-10': size === 'icon',
						'h-8 w-8': size === 'icon-sm',
					},
					{
						'text-white bg-indigo-500 hover:bg-indigo-500/80 active:bg-indigo-500/60':
							variant === 'default',
						'bg-black text-white hover:bg-black/80 active:bg-black/60 dark:hover:opacity-70':
							variant === 'black',
						'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300 active:bg-neutral-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 dark:active:bg-zinc-800 dark:hover:border-zinc-600':
							variant === 'secondary',
						'bg-rose-600 text-white hover:bg-rose-600/90 active:bg-rose-600/80':
							variant === 'destructive',
						'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
						'text-sky-600 underline-offset-4 hover:underline':
							variant === 'link',
					},
					className,
				)}
				ref={ref}
				{...props}
			>
				<>
					{!loading && icon && <FontAwesomeIcon icon={icon} className={cn("h-3 w-3", { "mr-2" : !size.includes('icon')})} />}
					{loading && <FontAwesomeIcon icon={faSpinnerThird} className="fa-spin h-3 w-3 mr-2" />}
					{children}
				</>
			</Comp>
		);
	},
);
Button.displayName = 'Button';

export { Button, type ButtonProps };
