'use client';
import { faRightFromBracket } from '@fortawesome/pro-solid-svg-icons/faRightFromBracket';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import Image from 'next/image';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from '../ui/dropdown';
import { useRetrieveSession } from '@/api/client/auth';

export const UserProfile = () => {
  const { isLoading, data: session } = useRetrieveSession({
    axios: { withCredentials: true },
  });

  if (isLoading) return null;
  if (!session) return null;

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Image
          alt={session.data.emailAddress}
          src={session.data.profilePictureUrl}
          width={36}
          height={36}
          className="rounded-full border dark:border-white/10 drop-shadow-sm"
        />
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent className="w-[270px]">
          <div className="flex space-x-3 px-3 py-3">
            <Image
              src={session.data.profilePictureUrl}
              height={40}
              width={40}
              alt="User image"
              className="rounded-full"
            />
            <div className="flex flex-col text-sm">
              <div className="text-black dark:text-zinc-300 font-medium">
                {session.data.firstName || 'Aviator'}
              </div>
              <div className="text-neutral-600 dark:text-zinc-400">
                {session.data.emailAddress}
              </div>
            </div>
          </div>
          <div className="px-2">
            <DropdownItem
              label="Profile"
              icon={faUser}
              onClick={() => {}}
            />
            <DropdownItem
              label="Sign out"
              icon={faRightFromBracket}
              onClick={() => {}}
            />
          </div>
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};
