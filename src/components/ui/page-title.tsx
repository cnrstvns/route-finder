import { cn } from '@/lib/utils';

type PageTitleProps = {
	title: string;
	subtitle?: string;
	className?: string;
};

const PageTitle = ({ title, subtitle, className }: PageTitleProps) => {
	return (
		<div
			className={cn(
				'flex flex-col space-y-1 px-4 md:px-6 border-b pb-6',
				className,
			)}
		>
			<h1 className="font-semibold text-lg md:text-2xl">{title}</h1>
			{subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
		</div>
	);
};

PageTitle.displayName = 'PageTitle';

export { PageTitle, type PageTitleProps };
