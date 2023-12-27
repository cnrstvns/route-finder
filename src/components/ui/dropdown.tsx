'use client';
import { cn } from '@/lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';

type DropdownItemProps = ComponentProps<typeof DropdownItemPrimitive> & {
	onClick: () => void;
	label: string;
	icon: IconProp;
};

type DropdownContentProps = ComponentProps<typeof DropdownContentPrimitive> & {
	className?: string;
};

const Dropdown = DropdownPrimitive.Root;
const DropdownTrigger = DropdownPrimitive.Trigger;
const DropdownPortal = DropdownPrimitive.Portal;
const DropdownContentPrimitive = DropdownPrimitive.Content;
const DropdownItemPrimitive = DropdownPrimitive.Item;

const DropdownItem = ({ onClick, label, icon }: DropdownItemProps) => {
	return (
		<DropdownPrimitive.Item asChild>
			<button
				type="button"
				onClick={onClick}
				className="w-full flex rounded-md text-start text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:outline-0 hover:bg-neutral-100 dark:active:bg-zinc-800 dark:hover:bg-zinc-800"
			>
				<div className="px-2 py-2 flex items-center ml-2">
					<div className="h-5 w-5 flex items-center justify-center px-3">
						<FontAwesomeIcon className="mr-5" icon={icon} />
					</div>
					<div className="text-sm font-medium">{label}</div>
				</div>
			</button>
		</DropdownPrimitive.Item>
	);
};
DropdownItem.displayName = 'DropdownItem';

const DropdownContent = ({
	children,
	className,
	...props
}: DropdownContentProps) => {
	return (
		<DropdownPrimitive.Content
			align="end"
			sideOffset={-10}
			side="top"
			className={cn(
				'drop-shadow-2xl z-50 mt-4 pb-2 rounded-md border bg-neutral-50 dark:bg-zinc-900 dark:border-white/10 text-black',
				{
					className,
				},
			)}
			{...props}
		>
			{children}
		</DropdownPrimitive.Content>
	);
};
DropdownContent.displayName = 'DropdownContent';

export {
	Dropdown,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	DropdownPortal,
};
