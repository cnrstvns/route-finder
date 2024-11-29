import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Route } from '../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MobileMenuItem = ({ route }: { route: Route }) => {
  const pathName = usePathname();
  const active = pathName === route.href;

  return (
    <Link
      href={route.href}
      className={cn(
        'px-6 py-1.5 flex cursor-default items-center hover:bg-neutral-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none',
        {
          'bg-neutral-100 text-neutral-900 dark:bg-zinc-800 dark:text-zinc-300':
            active,
        },
      )}
      key={route.href}
    >
      <div className="h-5 w-5 flex items-center justify-center">
        <FontAwesomeIcon className="mr-5" icon={route.icon} />
      </div>
      <div className="text-sm font-medium">{route.title}</div>
    </Link>
  );
};
