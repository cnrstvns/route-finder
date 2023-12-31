import { cn } from '@/lib/utils';
import { Search } from '../ui/search';
import { MobileMenu } from './mobile-menu';
import { UserProfile } from './user-profile';

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
      <div className="flex items-center space-x-3 lg:space-x-0">
        <MobileMenu />
        {searchPlaceholder && <Search placeholder={searchPlaceholder} />}
      </div>
      {profile && <UserProfile />}
    </div>
  );
};

export { Header };
