import '@/lib/env';
import { airport as airportTable, db } from '@/db';
import fs from 'fs';
import { eq } from 'drizzle-orm';
import path from 'path';

(async () => {
	const fileData = fs.readFileSync(
		path.join(__dirname, 'airports_elevation.csv'),
	);
	const rows = fileData.toString().split('\n');

	rows.shift();

	for (const row of rows) {
		const split = row.trim().split(',');
		const elevation = split[5];
		const iataCode = split[9];

		if (elevation && iataCode) {
			console.log(elevation, iataCode);

			await db
				.update(airportTable)
				.set({
					elevation,
				})
				.where(eq(airportTable.iataCode, iataCode));
		}
	}
})();
