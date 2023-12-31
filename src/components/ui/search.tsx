'use client';
import { cn } from '@/lib/utils';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type SearchProps = {
  placeholder: string;
  disabled?: boolean;
};

const Search = ({ disabled, placeholder }: SearchProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-60 md:w-72">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="rounded-md shadow-sm">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden="true"
        >
          <FontAwesomeIcon
            className={cn('dark:text-zinc-400', { 'fa-spin': isPending })}
            icon={isPending ? faSpinnerThird : faMagnifyingGlass}
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          disabled={disabled}
          className="h-9 block focus:shadow-md focus:outline-none w-full rounded-md border border-neutral-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 pl-9 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 text-sm"
          placeholder={placeholder}
          spellCheck={false}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

Search.displayName = 'Search';

export { Search };
