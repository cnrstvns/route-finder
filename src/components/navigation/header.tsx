import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type HeaderProps = {
	children: ReactNode;
	className?: string;
};

const Header = ({ children, className }: HeaderProps) => {
	return (
		<div
			className={cn(
				'w-full lg:w-[calc(100%-250px)] fixed top-0 z-50 flex items-center px-4 bg-gray-50 h-[60px] border-b',
				className,
			)}
		>
			{children}
		</div>
	);
};

export { Header };
