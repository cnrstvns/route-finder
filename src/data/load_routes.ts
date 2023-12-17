import { airport, db, route as routeTable } from '@/db';
import '@/lib/env';
import { and, eq } from 'drizzle-orm';
import fetch from 'node-fetch';
import type { Route } from './types';

(async () => {
	const response = await fetch('https://www.flightsfrom.com/api/airline/BA', {
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			'cache-control': 'no-cache',
			pragma: 'no-cache',
			'sec-ch-ua': '"Chromium";v="119", "Not?A_Brand";v="24"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
			'x-xsrf-token':
				'eyJpdiI6Ilg2VHkwMkxqeVlFSGkycEExMjlOUHc9PSIsInZhbHVlIjoidFk3RFM1WDluK3BKY2Z3MzBcLzlDd1VkUDhldldoQVYrN2pRdEhkUWhjWVp2eUd2NXBvU0ZTVTZUeFh1XC9FMyt3ZWxsQzNTSVhqTjFXVW5QVEZqWGRVQT09IiwibWFjIjoiYWFiNjYwNTBlN2IyM2UyMTBkMDM1MTVlYjE4YzgzZTQ0YzA5NDA4OWIwN2EwNzNjZDZhMWRiYTE5Yjg1NmE3NiJ9',
			cookie:
				'nad=1; unad=XseVY0wEfEFvpRYEtTqDx4KQ2YZC2i4y; XSRF-TOKEN=eyJpdiI6Ilg2VHkwMkxqeVlFSGkycEExMjlOUHc9PSIsInZhbHVlIjoidFk3RFM1WDluK3BKY2Z3MzBcLzlDd1VkUDhldldoQVYrN2pRdEhkUWhjWVp2eUd2NXBvU0ZTVTZUeFh1XC9FMyt3ZWxsQzNTSVhqTjFXVW5QVEZqWGRVQT09IiwibWFjIjoiYWFiNjYwNTBlN2IyM2UyMTBkMDM1MTVlYjE4YzgzZTQ0YzA5NDA4OWIwN2EwNzNjZDZhMWRiYTE5Yjg1NmE3NiJ9; laravel_session=eyJpdiI6ImF3VTU5RkN2VzNFY0VudVA0cUQ1eUE9PSIsInZhbHVlIjoiVXVCUHE3eDVqMGhSalZhXC96c2VVV1hWMHd5S2ZcLzJrVUNLdjJNQW40NUt6NmkwWmpBVU82Rm5YUG50VXF5SXVhMUx3WDNZOE4yeUVHTFwvcGx3bFpXTmc9PSIsIm1hYyI6IjQxYjUzNGJlYjAxM2U3MjhlODNmNjBhMzdhOGUzMGMwMGU1OWIwYWYyOWZmMzQ0MjU4NzZiYTczYzBhZGYxYTMifQ%3D%3D',
			Referer: 'https://www.flightsfrom.com/BA',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
		},
		body: null,
		method: 'GET',
	}).then((response) => response.json());

	// @ts-expect-error
	const routes = response.routes as Route[];

	for (const route of routes) {
		if (!route.aircraft_codes) continue;

		console.log(
			`Flight ${route.airline.callsign} ${route.departure.IATA}-${route.destination.IATA} — max ${route.max_duration} on ${route.aircraft_codes}`,
		);

		const existingOriginAirport = await db
			.select()
			.from(airport)
			.where(eq(airport.iataCode, route.departure.IATA));

		console.log(existingOriginAirport);

		if (!existingOriginAirport.length) {
			// create airport
			console.log(`Creating ${route.departure.IATA}`);

			await db.insert(airport).values({
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
			.from(airport)
			.where(eq(airport.iataCode, route.destination.IATA));

		if (!existingDestinationAirport.length) {
			// create airport
			console.log(`Creating ${route.destination.IATA}`);

			await db.insert(airport).values({
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
			console.log(`Creating ${route.departure.IATA}-${route.destination.IATA}`);

			await db.insert(routeTable).values({
				airlineIata: route.airline.IATA,
				originIata: route.departure.IATA,
				destinationIata: route.destination.IATA,
				aircraftCodes: route.aircraft_codes.replaceAll(' ', ''),
				averageDuration: Number(route.common_duration),
			});
		}
	}
})();
