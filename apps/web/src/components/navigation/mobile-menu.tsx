'use client';
import { cn } from '@/lib/utils';
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from './navbar';

const MobileMenu = () => {
  const pathName = usePathname();

  return (
    <div className="flex lg:hidden">
      <Dialog>
        <DialogTrigger>
          <div
            className={cn(
              'h-9 w-9 cursor-default flex items-center justify-center hover:border hover:border-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 rounded-md',
              'data-[state=open]:bg-neutral-200 data-[state=open]:dark:bg-zinc-800 data-[state=open]:border data-[state=open]:dark:border-zinc-700',
            )}
          >
            <FontAwesomeIcon className="dark:text-white/60" icon={faBars} />
          </div>
        </DialogTrigger>

        <DialogContent>
          <div className="flex top-[60px] left-0 absolute w-screen justify-center p-1 select-none">
            <div className="w-full px-2 space-y-1 py-3 border shadow-lg rounded-md bg-neutral-50 dark:bg-zinc-900 dark:border-white/10">
              {routes.map((r) => {
                const active = r.href === pathName;

                return (
                  <Link
                    href={r.href}
                    className={cn(
                      'px-6 py-1.5 flex cursor-default items-center hover:bg-neutral-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none',
                      {
                        'bg-neutral-100 text-neutral-900 dark:bg-zinc-800 dark:text-zinc-300':
                          active,
                      },
                    )}
                    key={r.href}
                  >
                    <div className="h-5 w-5 flex items-center justify-center">
                      <FontAwesomeIcon className="mr-5" icon={r.icon} />
                    </div>
                    <div className="text-sm font-medium">{r.title}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { MobileMenu };
