import { PageTitle } from '@/components/ui/page-title';
import { api } from '@/server/api';
import { redirect } from 'next/navigation';
import { RouteForm } from './form';

type PageParams = { params: { airlineId: string } };

export default async function NewFlight({ params }: PageParams) {
	const { airline, aircraft } = await api.airline.newFlight.query(params);

	if (!airline) redirect('/');

	return (
		<div>
			<PageTitle
				title={`New ${airline.name} Flight`}
				subtitle="Choose how long you'd like to fly, and on what equipment. We'll do the rest."
			/>

			<RouteForm airline={airline.iataCode} aircraft={aircraft} />
		</div>
	);
}
