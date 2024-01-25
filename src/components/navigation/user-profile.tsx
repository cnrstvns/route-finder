'use client';
import { useClerk, useUser } from '@clerk/nextjs';
import { faRightFromBracket } from '@fortawesome/pro-solid-svg-icons/faRightFromBracket';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from '../ui/dropdown';

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
        <DropdownContent className="w-[270px]">
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
                {user?.fullName || 'Aviator'}
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
