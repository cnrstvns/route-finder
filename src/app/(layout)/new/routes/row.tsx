'use client';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { formatMinutes } from '@/lib/time';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { SaveRoute } from '@/components/routes/save-route';
import type { RouteResult } from './types';

type RowProps = {
	route: RouteResult;
};

const Row = ({ route }: RowProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const aircraft = useMemo(
		() => searchParams.get('aircraft')?.split(',') || [],
		[searchParams],
	);

	const navigate = useCallback(() => {
		router.push(`/routes/${route.id}`);
	}, [router, route]);

	return (
		<TableRow onClick={navigate}>
			<TableCell>
				<Tooltip
					trigger={
						<span className="font-medium text-black dark:text-zinc-200">
							{route.origin_iata}
						</span>
					}
					children={route.origin_name}
				/>
			</TableCell>
			<TableCell>
				<Tooltip
					trigger={
						<span className="font-medium text-black dark:text-zinc-200">
							{route.destination_iata}
						</span>
					}
					children={route.destination_name}
				/>
			</TableCell>
			<TableCell>{formatMinutes(route.average_duration)}</TableCell>
			<TableCell className="space-x-2">
				{route.aircraft_short_names
					.split(',')
					.filter((ac) => aircraft.includes(ac))
					.map((ac) => (
						<Badge key={ac} variant="blue">
							{ac}
						</Badge>
					))}
				{route.aircraft_short_names
					.split(',')
					.filter((ac) => !aircraft.includes(ac))
					.map((ac) => (
						<Badge key={ac} variant="gray">
							{ac}
						</Badge>
					))}
			</TableCell>
			<TableCell className="flex w-full justify-end p-0 pr-6 py-2.5">
				<SaveRoute
					size="icon-sm"
					routeId={route.id}
					initialData={{
						route: {
							routeId: route.id,
							id: route.user_route_id,
							userId: route.user_route_user_id,
							createdAt: route.user_route_created_at,
						},
						success: true,
					}}
				/>
			</TableCell>
		</TableRow>
	);
};

export { Row };
