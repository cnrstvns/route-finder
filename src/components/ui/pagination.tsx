'use client';
import { PAGE_SIZE } from '@/lib/constants';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useCallback } from 'react';
import { Button } from './button';

type PaginationProps = {
	totalCount: number;
	resource: string;
};

const Pagination = ({ totalCount, resource }: PaginationProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = Number(searchParams.get('page') || 1);
	const hasMore = page * PAGE_SIZE < totalCount;
	const hasPrev = page > 1;
	const showing = `Showing ${page * PAGE_SIZE - PAGE_SIZE + 1}-${Math.min(
		page * PAGE_SIZE,
		totalCount,
	)} of ${totalCount} ${totalCount === 1 ? resource : `${resource}s`}`;

	const goToPrevious = useCallback(() => {
		const params = new URLSearchParams(searchParams);
		params.set('page', (page - 1).toString());

		posthog.capture('Clicked to previous page', {
			pathname,
			from: page,
			to: page - 1,
		});

		router.push(`${pathname}?${params.toString()}`);
	}, [pathname, searchParams, router, page]);

	const goToNext = useCallback(() => {
		const params = new URLSearchParams(searchParams);
		params.set('page', (page + 1).toString());

		posthog.capture('Clicked to next page', {
			pathname,
			from: page,
			to: page + 1,
		});

		router.push(`${pathname}?${params.toString()}`);
	}, [pathname, searchParams, router, page]);

	return (
		<div className="flex w-full justify-between items-center border-t dark:border-white/10 py-2 px-6">
			<div className="text-neutral-500 text-sm">{showing}</div>

			<div className="space-x-2">
				<Button
					onClick={goToPrevious}
					disabled={!hasPrev}
					type="button"
					variant="secondary"
					size="sm"
				>
					Previous
				</Button>
				<Button
					onClick={goToNext}
					disabled={!hasMore}
					type="button"
					variant="secondary"
					size="sm"
				>
					Next
				</Button>
			</div>
		</div>
	);
};

Pagination.displayName = 'Pagination';

export { Pagination };
