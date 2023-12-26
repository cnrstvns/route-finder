'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRightFromBracket } from '@fortawesome/pro-solid-svg-icons/faRightFromBracket';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownPortal,
	DropdownTrigger,
} from '../ui/dropdown';

type ProfileButtonProps = {
	onClick: () => void;
	label: string;
	icon: IconProp;
};

const ProfileButton = ({ onClick, label, icon }: ProfileButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full flex rounded-md text-start text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:outline-0 hover:bg-neutral-100"
		>
			<div className="px-2 py-2 flex items-center ml-2">
				<div className="h-5 w-5 flex items-center justify-center px-3">
					<FontAwesomeIcon className="mr-5" icon={icon} />
				</div>
				<div className="text-sm font-medium">{label}</div>
			</div>
		</button>
	);
};

const UserProfile = () => {
	const { isLoaded, user } = useUser();
	const { signOut, openUserProfile } = useClerk();
	const router = useRouter();

	if (!isLoaded) return null;
	if (!user?.id) return null;

	return (
		<Dropdown>
			<DropdownTrigger asChild>
				<Image
					alt={user?.primaryEmailAddress?.emailAddress || 'User email address'}
					src={user?.imageUrl}
					width={36}
					height={36}
					className="rounded-full border dark:border-white/10 drop-shadow-sm"
				/>
			</DropdownTrigger>
			<DropdownPortal>
				<DropdownContent>
					<div className="flex space-x-3 px-3 py-3">
						<Image
							src={user?.imageUrl}
							height={40}
							width={40}
							alt="User image"
							className="rounded-full"
						/>
						<div className="flex flex-col text-sm">
							<div className="text-black dark:text-zinc-300 font-medium">
								{user?.fullName}
							</div>
							<div className="text-neutral-600 dark:text-zinc-400">
								{user?.primaryEmailAddress?.emailAddress}
							</div>
						</div>
					</div>
					<div className="px-2">
						<DropdownItem
							label="Profile"
							icon={faUser}
							onClick={() => openUserProfile()}
						/>
						<DropdownItem
							label="Sign out"
							icon={faRightFromBracket}
							onClick={() => signOut(() => router.push('/'))}
						/>
					</div>
				</DropdownContent>
			</DropdownPortal>
		</Dropdown>
	);
};

export { UserProfile };
