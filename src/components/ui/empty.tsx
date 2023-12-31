import { cn } from '@/lib/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type EmptyProps = {
  icon: IconProp;
  title: string;
  subtitle: string;
  className?: string;
};

const Empty = ({ icon, title, subtitle, className }: EmptyProps) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          'h-72 border dark:border-white/10 rounded flex flex-col space-y-2 items-center justify-center py-10',
          className,
        )}
      >
        <div className="flex justify-center items-center w-20 h-20 rounded-lg border shadow-lg dark:border-white/10 mb-6">
          <FontAwesomeIcon icon={icon} className="h-8 w-8 dark:text-zinc-500" />
        </div>
        <div className="text-xl font-medium dark:text-white">{title}</div>
        <div className="text-sm text-neutral-500 dark:text-zinc-500">
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export { Empty };
