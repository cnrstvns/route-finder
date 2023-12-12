import { airline, db } from '@/db';
import '@/lib/env';

export const airlines = [
	['American Airlines', 'AA'],
	['Southwest Airlines', 'WN'],
	['United Airlines', 'UA'],
	['Delta Air Lines', 'DL'],
	['Ryanair', 'FR'],
	['Lufthansa', 'LH'],
	['Air France', 'AF'],
	['KLM Royal Dutch Airlines', 'KL'],
	['Air Canada', 'AC'],
	['Alaska Airlines', 'AS'],
	['easyJet', 'U2'],
	['JetBlue Airways', 'B6'],
	['Japan Air Lines', 'JL'],
	['Porter Airlines', 'PD'],
	['Hawaiian Airlines', 'HA'],
];

const mappedAirlines = airlines.map((al) => ({
	name: al[0],
	iataCode: al[1],
	slug: al[0].toLowerCase().split(' ').join('-'),
	logoPath: `${al[0].toLowerCase().split(' ').join('_')}.png`,
}));

async function loadAirlines() {
	await db.insert(airline).values(mappedAirlines);

	console.log('Successfully inserted airlines');
	process.exit(0);
}
