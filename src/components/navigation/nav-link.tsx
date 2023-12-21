'use client';
import { cn } from '@/lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
	href: string;
	title: string;
	icon?: IconProp;
};

const NavLink = ({ href, title, icon }: NavLinkProps) => {
	const pathName = usePathname();
	const active = href === pathName;

	return (
		<Link
			className={cn(
				'flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-500 transition-all hover:text-neutral-900 dark:hover:text-zinc-300 active:bg-indigo-600/10 cursor-default',
				{
					'bg-neutral-100 text-neutral-900 dark:bg-zinc-800 dark:text-zinc-300':
						active,
				},
			)}
			href={href}
		>
			{icon && <FontAwesomeIcon icon={icon} className="h-4 w-4" />}
			{title}
		</Link>
	);
};

export { NavLink };
