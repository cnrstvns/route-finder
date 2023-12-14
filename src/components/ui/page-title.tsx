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
				'flex flex-col space-y-1 px-4 md:px-6 border-b py-6',
				{
					'mt-[60px]': header,
				},
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
