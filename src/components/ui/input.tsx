import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					// 'disabled:cursor-not-allowed disabled:opacity-50 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus-visible:ring-0 focus-visible:outline-none',
					// 'dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-400 dark:text-white dark:focus:border-indigo-500',
					'flex items-center h-10 focus:shadow-md focus:outline-none w-full rounded-md border border-neutral-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 px-3 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 text-sm',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input };
