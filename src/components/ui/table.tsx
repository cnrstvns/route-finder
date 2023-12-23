import { cn } from '@/lib/utils';
import React from 'react';

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full">
		<table
			ref={ref}
			className={cn('w-full table-auto border-collapse text-sm', className)}
			{...props}
		/>
	</div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead ref={ref} className={className} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody ref={ref} className={cn('bg-white', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			'border-t dark:border-white/10 bg-muted/50 font-medium [&>tr]:last:border-b-0',
			className,
		)}
		{...props}
	/>
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			'border-b last-of-type:border-b-0 hover:bg-neutral-50 dark:bg-zinc-900 dark:text-white/60 dark:hover:bg-zinc-800 dark:border-white/10',
			className,
		)}
		{...props}
	/>
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			'h-12 text-left align-middle border-b dark:border-white/10 font-medium px-6 py-3 bg-neutral-50 dark:bg-zinc-800 dark:text-white/90 text-xs text-neutral-500 uppercase tracking-wider',
			className,
		)}
		{...props}
	/>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			'align-middle px-6 py-4 whitespace-nowrap text-neutral-700 dark:text-white/80',
			className,
		)}
		{...props}
	/>
));
TableCell.displayName = 'TableCell';

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
};
