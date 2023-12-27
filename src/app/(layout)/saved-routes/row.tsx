'use client';
import { RouterOutputs } from '@/server/routers/_app';
import { TableRow, TableCell } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { formatMinutes } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import { dayjs } from '@/lib/time';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

type SavedRoute = RouterOutputs['userRoute']['listSavedRoutes']['data'][number];
type RowProps = {
	route: SavedRoute;
};

const Row = ({ route }: RowProps) => {
	const router = useRouter();
	const navigate = useCallback(() => {
		router.push(`/routes/${route.route?.id}`);
	}, [route]);

	return (
		<TableRow onClick={navigate}>
			<TableCell>
				<Tooltip
					trigger={
						<span className="font-medium text-black dark:text-zinc-200">
							{route.origin?.iataCode}
						</span>
					}
					children={route.origin?.name}
				/>
			</TableCell>
			<TableCell>
				<Tooltip
					trigger={
						<span className="font-medium text-black dark:text-zinc-200">
							{route.destination?.iataCode}
						</span>
					}
					children={route.destination?.name}
				/>
			</TableCell>
			<TableCell>{route.airline?.name}</TableCell>
			<TableCell>{formatMinutes(route.route?.averageDuration || 0)}</TableCell>
			<TableCell className="space-x-2">
				{route.route?.aircraftCodes.split(',').map((ac) => (
					<Badge key={ac} variant="gray">
						{ac}
					</Badge>
				))}
			</TableCell>
			<TableCell>{dayjs(route.user_route.createdAt).fromNow()}</TableCell>
		</TableRow>
	);
};

export { Row };
