import { PageTitle } from '@/components/ui/page-title';
import { aircraft, airline as airlineTable, db } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { RouteForm } from './form';

type PageParams = { params: { airlineId: string } };
type AircraftResults = {
	rows: { id: number; iata_code: string; model_name: string }[];
};

export default async function NewFlight({ params }: PageParams) {
	const airlineResults = await db
		.select()
		.from(airlineTable)
		.where(eq(airlineTable.slug, params.airlineId));
	const airline = airlineResults[0];

	const aircraftQuery = sql`
    select distinct aircraft.iata_code, aircraft.model_name
    from route
    join lateral unnest(string_to_array(route.aircraft_codes, ',')) as t(aircraft_type) on true
    join aircraft on aircraft.iata_code = t.aircraft_type
    where route.airline_iata = ${airline.iataCode};
  `;
	const aircraftResults: AircraftResults = await db.execute(aircraftQuery);

	if (!airline) redirect('/');

	return (
		<div>
			<PageTitle
				title={`New ${airline.name} Flight`}
				subtitle="Choose how long you'd like to fly, and on what equipment. We'll do the rest."
			/>

			<RouteForm airline={airline.iataCode} aircraft={aircraftResults.rows} />
		</div>
	);
}
