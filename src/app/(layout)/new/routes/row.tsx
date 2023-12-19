'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { formatMinutes } from '@/lib/time';
import { useRouter } from 'next/navigation';

type RouteResult = {
	id: number;
	origin_iata: string;
	destination_iata: string;
	origin_name: string;
	destination_name: string;
	average_duration: number;
	aircraft_short_names: string;
};

export default function Row({
	aircraft,
	route,
}: { aircraft: string[]; route: RouteResult }) {
	const router = useRouter();
	return (
		<TableRow
			className="cursor-pointer"
			onClick={() => router.push(`/new/routes/${route.id}`)}
			key={route.id}
		>
			<TableCell>
				<Tooltip
					trigger={
						<span className="font-medium text-black">{route.origin_iata}</span>
					}
					children={route.origin_name}
				/>
			</TableCell>
			<TableCell>
				<Tooltip
					trigger={
						<span className="font-medium text-black">
							{route.destination_iata}
						</span>
					}
					children={route.destination_name}
				/>{' '}
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
		</TableRow>
	);
}