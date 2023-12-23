import { cn } from '@/lib/utils';

type PageTitleProps = {
	title: string;
	subtitle?: string;
	className?: string;
	header?: boolean;
};

const PageTitle = ({ title, subtitle, header, className }: PageTitleProps) => {
	return (
		<div
			className={cn(
				'flex flex-col w-full lg:w-[calc(100%-250px)] space-y-1 px-4 md:px-6 border-b dark:border-white/10 py-6 dark:bg-zinc-900',
				{
					'mt-[60px]': header,
				},
				className,
			)}
		>
			<h1 className="font-semibold text-lg md:text-2xl dark:text-white">
				{title}
			</h1>
			{subtitle && (
				<p className="text-neutral-500 dark:text-zinc-400 text-sm">
					{subtitle}
				</p>
			)}
		</div>
	);
};

PageTitle.displayName = 'PageTitle';

export { PageTitle, type PageTitleProps };
