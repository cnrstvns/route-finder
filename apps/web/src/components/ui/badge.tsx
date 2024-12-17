import clsx from 'clsx';
import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant: 'blue' | 'gray';
};

export const Badge = ({ children, variant }: BadgeProps) => {
  return (
    <span
      className={clsx('px-1 py-0.5 rounded-[4px] font-medium ', {
        'bg-sky-300/70 text-sky-800 dark:bg-sky-300/90 dark:text-sky-900':
          variant === 'blue',
        'bg-neutral-300/70 text-neutral-600 dark:bg-zinc-700 dark:text-white/70':
          variant === 'gray',
      })}
    >
      {children}
    </span>
  );
};
