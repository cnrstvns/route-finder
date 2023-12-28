import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type PageTitleProps = {
	title: string;
	subtitle?: string;
	className?: string;
	header?: boolean;
	children?: ReactNode;
};

const PageTitle = ({
	title,
	subtitle,
	header,
	className,
	children,
}: PageTitleProps) => {
	return (
		<div
			className={cn(
				'flex w-full justify-between items-center px-4 md:px-6 border-b dark:border-white/10 py-6 dark:bg-zinc-900',
				{
					'mt-[60px]': header,
				},
				className,
			)}
		>
			<div className="flex flex-col">
				<h1 className="font-semibold text-lg md:text-2xl dark:text-white">
					{title}
				</h1>
				{subtitle && (
					<p className="text-neutral-500 dark:text-zinc-400 text-sm">
						{subtitle}
					</p>
				)}
			</div>
			{children}
		</div>
	);
};

PageTitle.displayName = 'PageTitle';

export { PageTitle, type PageTitleProps };
