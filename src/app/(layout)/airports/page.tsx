import { Header } from '@/components/navigation/header';
import { PageTitle } from '@/components/ui/page-title';
import { Pagination } from '@/components/ui/pagination';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { airport, db } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { ilike, or, sql } from 'drizzle-orm';

type PageParams = { searchParams: { q: string; page?: string } };
type AirportResult = {
	id: number;
	iata_code: string;
	name: string;
	city: string;
	country: string;
};

export default async function Airports({ searchParams }: PageParams) {
	const page = Number(searchParams.page ?? 1);
	const query = sql`SELECT * FROM ${airport}`;

	if (searchParams.q) {
		query.append(
			sql`WHERE ${or(
				ilike(airport.name, `%${searchParams.q}%`),
				ilike(airport.iataCode, `%${searchParams.q}%`),
				ilike(airport.city, `%${searchParams.q}%`),
				ilike(airport.country, `%${searchParams.q}%`),
			)}`,
		);
	}

	const countQuery = await db.execute<{ count: number }>(
		sql`SELECT count(*) FROM (${query})`,
	);
	const totalCount = countQuery.rows[0].count;

	query.append(sql`
    ORDER BY
			${airport.iataCode}
		LIMIT
      ${PAGE_SIZE}
    OFFSET
      ${page * PAGE_SIZE - PAGE_SIZE}
  `);

	const { rows: airports } = await db.execute<AirportResult>(query);

	return (
		<div>
			<Header searchPlaceholder="Search for an airport..." profile />

			<PageTitle
				title="Airports"
				subtitle="List of airports and their IATA codes."
				header
			/>

			<Table className="w-full divide-y divide-neutral-200">
				<TableHeader>
					<TableRow>
						<TableHead>IATA Code</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>City</TableHead>
						<TableHead>Country</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-neutral-200">
					{airports.map((airport) => (
						<TableRow key={airport.id}>
							<TableCell>
								<div className="text-sm font-medium text-neutral-900">
									{airport.iata_code}
								</div>
							</TableCell>
							<TableCell>{airport.name}</TableCell>
							<TableCell>{airport.city}</TableCell>
							<TableCell>{airport.country}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Pagination totalCount={totalCount} resource="airport" />
		</div>
	);
}
