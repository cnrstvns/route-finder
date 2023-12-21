import { airport as airportTable, db } from '@/db';
import '@/lib/env';
import icao from './icao.json';
import { eq } from 'drizzle-orm';

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
