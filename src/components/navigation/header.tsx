import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { Search } from '../ui/search';
import { MobileMenu } from './mobile-menu';

type HeaderProps = {
	className?: string;
	searchPlaceholder?: string;
	profile?: boolean;
};

const Header = ({ searchPlaceholder, profile, className }: HeaderProps) => {
	return (
		<div
			className={cn(
				'w-full lg:w-[calc(100%-250px)] justify-between fixed top-0 z-50 flex items-center px-4 bg-neutral-50 dark:bg-zinc-900 h-[60px] border-b dark:border-white/10',
				className,
			)}
		>
			<div className="flex items-center space-x-5 lg:space-x-0">
				<MobileMenu />
				{searchPlaceholder && <Search placeholder={searchPlaceholder} />}
			</div>
			{profile && (
				<UserButton
					appearance={{
						elements: {
							userButtonTrigger:
								'focus:ring focus:ring-1 focus:ring-indigo-400',
							userButtonPopoverCard:
								'bg-neutral-50 py-3 w-[270px] rounded-md shadow-xl border border-neutral-200 dark:text-white dark:bg-zinc-900 dark:border-white/10',
						},
					}}
				/>
			)}
		</div>
	);
};

export { Header };
