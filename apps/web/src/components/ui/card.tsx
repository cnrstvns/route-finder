'use client';
import { cn } from '@/lib/utils';
import copy from 'copy-to-clipboard';
import { forwardRef, useCallback, useState } from 'react';

type CardRowProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string;
  copyable?: boolean;
};

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-x-0 border-y md:rounded-lg md:border-x bg-card text-black dark:text-white dark:border-white/10 shadow-sm',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500 dark:text-zinc-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

const CardRow = forwardRef<HTMLDivElement, CardRowProps>(
  ({ className, label, value, copyable, ...props }, ref) => {
    const [hovering, setHovering] = useState(false);
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
      setCopied(true);
      copy(value);
      setTimeout(() => setCopied(false), 1000);
    }, [value]);

    return (
      <div
        ref={ref}
        onClick={copyable ? handleCopy : undefined}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={cn(
          'flex items-center cursor-default justify-between border-b py-1.5 text-sm first-of-type:pt-0 last-of-type:border-0 dark:border-white/10',
          className,
        )}
        {...props}
      >
        <div className="text-neutral-700 dark:text-white/80 font-medium">
          {label}
        </div>
        {!copyable && (
          <div className="text-neutral-500 dark:text-zinc-500">{value}</div>
        )}
        {copyable &&
          (() => {
            if (copied) return <div className="text-indigo-500">Copied</div>;
            if (hovering) return <div className="text-indigo-500">Copy</div>;
            return (
              <div className="text-neutral-500 dark:text-zinc-500">{value}</div>
            );
          })()}
      </div>
    );
  },
);
CardRow.displayName = 'CardRow';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardRow,
};
