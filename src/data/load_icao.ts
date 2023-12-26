import { airport as airportTable, db } from '@/db';
import '@/lib/env';
import { eq } from 'drizzle-orm';
import icao from './icao.json';

(async () => {
	for (const airport of icao) {
		if (!airport.icao) {
			continue;
		}

		await db
			.update(airportTable)
			.set({
				icaoCode: airport.icao,
			})
			.where(eq(airportTable.iataCode, airport.iata));
	}
})();
