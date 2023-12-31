import { airport as airportTable, route as routeTable, db } from '@/db';
import { inngest } from '@/lib/inngest';
import { getRoutes } from '@/services/flights-from';
import { and, eq, isNull } from 'drizzle-orm';
import { NonRetriableError } from 'inngest';
import icao from './data/icao.json';
import elevations from './data/elevations.json';

export const addAirline = inngest.createFunction(
	{ id: 'add-airline' },
	{ event: 'admin/airline.add' },
	async ({ event, step }) => {
		const routes = await step.run(
			'fetch-routes',
			async () => await getRoutes(event.data.iataCode),
		);

		if (routes === null)
			throw new NonRetriableError(
				'Encountered an error while fetching routes.',
			);

		for (const route of routes) {
			if (!route.aircraft_codes) continue;

			await step.run('attempt-load-route', async () => {
				console.log(
					`Flight ${route.airline.callsign} ${route.departure.IATA}-${route.destination.IATA} — max ${route.max_duration} on ${route.aircraft_codes}`,
				);

				const existingOriginAirport = await db
					.select()
					.from(airportTable)
					.where(eq(airportTable.iataCode, route.departure.IATA));

				if (existingOriginAirport.length) {
					console.log(`Skipping ${route.departure.IATA}`);
				}

				if (!existingOriginAirport.length) {
					// create airport
					console.log(`Creating ${route.departure.IATA}`);

					await db.insert(airportTable).values({
						iataCode: route.departure.IATA,
						name: route.departure.name,
						city: route.departure.city_name,
						country: route.departure.country,
						longitude: route.departure.longitude,
						latitude: route.departure.latitude,
					});
				}

				const existingDestinationAirport = await db
					.select()
					.from(airportTable)
					.where(eq(airportTable.iataCode, route.destination.IATA));

				if (existingDestinationAirport.length) {
					console.log(`Skipping ${route.destination.IATA}`);
				}

				if (!existingDestinationAirport.length) {
					// create airport
					console.log(`Creating ${route.destination.IATA}`);

					await db.insert(airportTable).values({
						iataCode: route.destination.IATA,
						name: route.destination.name,
						city: route.destination.city_name,
						country: route.destination.country,
						longitude: route.destination.longitude,
						latitude: route.destination.latitude,
					});
				}

				const existingRoute = await db
					.select()
					.from(routeTable)
					.where(
						and(
							eq(routeTable.destinationIata, route.destination.IATA),
							eq(routeTable.originIata, route.departure.IATA),
						),
					);

				if (!existingRoute.length) {
					console.log(
						`Creating ${route.departure.IATA}-${route.destination.IATA}`,
					);

					await db.insert(routeTable).values({
						airlineIata: route.airline.IATA,
						originIata: route.departure.IATA,
						destinationIata: route.destination.IATA,
						aircraftCodes: route.aircraft_codes.replaceAll(' ', ''),
						averageDuration: Number(route.common_duration),
					});
				}
			});
		}

		const airportsWithoutElevation = await step.run(
			'find-airports-needing-elevation',
			async () => {
				return db
					.select()
					.from(airportTable)
					.where(isNull(airportTable.elevation));
			},
		);

		for (const airport of airportsWithoutElevation) {
			await step.run('attempt-backfill-elevation', async () => {
				const elevationAirport = elevations.find(
					(e) => e.iata_code === airport.iataCode,
				);
				if (!elevationAirport) return;

				return await db
					.update(airportTable)
					.set({
						elevation: elevationAirport.elevation_ft,
					})
					.where(eq(airportTable.iataCode, airport.iataCode))
					.returning();
			});
		}

		const airportsWithoutIcao = await step.run(
			'find-airports-needing-icao',
			async () => {
				return db
					.select()
					.from(airportTable)
					.where(isNull(airportTable.icaoCode));
			},
		);

		for (const airport of airportsWithoutIcao) {
			await step.run('attempt-backfill-icao', async () => {
				const icaoAirport = icao.find((e) => e.iata === airport.iataCode);
				if (!icaoAirport) return;

				return await db
					.update(airportTable)
					.set({
						icaoCode: icaoAirport.icao,
					})
					.where(eq(airportTable.iataCode, airport.iataCode))
					.returning();
			});
		}

		return {
			status: 'completed',
			event,
			body: `Successfully retrieved ${routes?.length} routes for ${event.data.iataCode}`,
		};
	},
);
