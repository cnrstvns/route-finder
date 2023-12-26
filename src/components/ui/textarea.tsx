import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	resizable?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, resizable, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					'flex min-h-[80px] w-full rounded border bg-white px-3 py-2 text-sm placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-400',
					'focus:outline-none focus:ring-indigo-500 focus:ring-offset-1 focus:ring-2 dark:focus:border-zinc-900',
					{ 'resize-none': !resizable },
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = 'Textarea';

export { Textarea };
