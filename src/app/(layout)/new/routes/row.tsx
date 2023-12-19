'use client';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { formatMinutes } from '@/lib/time';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type RouteResult = {
	id: number;
	origin_iata: string;
	destination_iata: string;
	origin_name: string;
	destination_name: string;
	average_duration: number;
	aircraft_short_names: string;
};

type RowProps = {
	aircraft: string[];
	route: RouteResult;
};

export default function Row({ aircraft, route }: RowProps) {
	const router = useRouter();
	const navigate = useCallback(
		(r: string) => {
			router.push(r);
		},
		[router],
	);

	return (
		<TableRow
			className="cursor-pointer"
			onClick={() => navigate(`/new/routes/${route.id}`)}
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
		</TableRow>
	);
}
