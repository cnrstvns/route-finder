import { Header } from '@/components/navigation/header';
import { airline, db, route } from '@/db';
import { sql } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { Title } from './title';

type Airline = {
	id: string;
	name: string;
	slug: string;
	logo_path: string;
	route_count: string;
};

type PageParams = { searchParams: { q: string } };

export default async function Home({ searchParams }: PageParams) {
	const query = sql`
    select a.id, a.name, a.slug, a.logo_path, count(r.id) as route_count
    from ${airline} a
    join ${route} r on r.airline_iata = a.iata_code group by a.id, a.name
		order by a.name
  `;

	if (searchParams.q) {
		query.append(sql` having a.name ilike ${`%${searchParams.q}%`};`);
	}

	if (!searchParams.q) {
		query.append(sql`;`);
	}

	const results = await db.execute(query);
	const airlines = results.rows as Airline[];

	return (
		<div>
			<Header searchPlaceholder="Search for an airline..." profile />

			<Title />

			<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				{airlines.map((airline) => (
					<AirlineCard key={airline.id} airline={airline} />
				))}
			</div>
		</div>
	);
}

async function AirlineCard({ airline }: { airline: Airline }) {
	return (
		<Link
			href={`/new/${airline.slug}`}
			className="border flex space-x-3 rounded-md shadow-sm py-4 px-4 hover:shadow-md transition-all duration-250"
		>
			<div className="flex flex-col h-full justify-center">
				<Image
					className="rounded-full"
					src={`/logos/${airline.logo_path}`}
					alt={airline.name}
					width={48}
					height={48}
				/>
			</div>
			<div className="flex flex-col">
				<div className="text-xl font-semibold">{airline.name}</div>
				<div className="text-gray-500">{airline.route_count} routes</div>
			</div>
		</Link>
	);
}