import { airport, db, route as routeTable } from '@/db';
import '@/lib/env';
import { and, eq } from 'drizzle-orm';
import fetch from 'node-fetch';

(async () => {
	const response = await fetch('https://www.flightsfrom.com/api/airline/EK', {
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
			Referer: 'https://www.flightsfrom.com/EK',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
		},
		body: null,
		method: 'GET',
	}).then((response) => response.json());

	// @ts-expect-error
	const routes = response.routes;

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

export interface Route {
	id: number;
	route_id: string;
	carrier: string;
	carrier_name: string;
	lcc: string;
	iata_from: string;
	iata_to: string;
	day1: string;
	day2: string;
	day3: string;
	day4: string;
	day5: string;
	day6: string;
	day7: string;
	aircraft_codes: string;
	first_flight?: null;
	last_flight: string;
	class_first: string;
	class_business: string;
	class_economy: string;
	common_duration: string;
	min_duration: string;
	max_duration: string;
	is_new: string;
	is_active: string;
	is_layover: string;
	passengers_per_day: string;
	created_at: string;
	updated_at: string;
	deleted_at?: null;
	last_found: string;
	flights_per_week: string;
	flights_per_day: string;
	airline: Airline;
	departure: DepartureOrDestination;
	destination: DepartureOrDestination;
}

export interface Airline {
	id: number;
	callsign: string;
	ICAO: string;
	IATA: string;
	name: string;
	fs_id: string;
	shortname: string;
	fullname?: null;
	country: string;
	flights_last_24_hours: string;
	airbourne: string;
	location: string;
	phone: string;
	url: string;
	wiki_url: string;
	is_scheduled_passenger: string;
	is_nonscheduled_passenger: string;
	is_cargo: string;
	is_railway?: null;
	is_lowcost: string;
	active: string;
	is_oneworld: string;
	is_staralliance: string;
	is_skyteam: string;
	is_allianceaffiliate: string;
	rating_iosapp?: null;
	rating_androidapp?: null;
	rating_skytrax_reviews?: null;
	rating_skytrax_stars?: null;
	rating_tripadvisor?: null;
	rating_trustpilot?: null;
	rating_flightradar24?: null;
	created_at: string;
	updated_at: string;
}

export interface DepartureOrDestination {
	IATA: string;
	latitude: string;
	longitude: string;
	country: string;
	country_code: string;
	city_name: string;
	city_name_en: string;
	name: string;
	no_routes: string;
	state_code: string;
}
