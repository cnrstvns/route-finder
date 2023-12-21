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
import { airline, db } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { ilike, or, sql } from 'drizzle-orm';

type PageParams = { searchParams: { q: string; page?: string } };
type AirlineResult = {
	id: number;
	name: string;
	iata_code: string;
};

export default async function Airlines({ searchParams }: PageParams) {
	const page = Number(searchParams.page ?? 1);
	const query = sql`SELECT * from ${airline}`;

	if (searchParams.q) {
		query.append(
			sql`WHERE ${or(
				ilike(airline.name, `%${searchParams.q}%`),
				ilike(airline.iataCode, `%${searchParams.q}%`),
			)}`,
		);
	}

	const countQuery = await db.execute<{ count: number }>(
		sql`SELECT count(*) FROM (${query})`,
	);
	const totalCount = countQuery.rows[0].count;

	query.append(sql`
		ORDER BY
			${airline.iataCode}
		LIMIT
			${PAGE_SIZE}
		OFFSET
			${page * PAGE_SIZE - PAGE_SIZE}
`);

	const { rows: airlines } = await db.execute<AirlineResult>(query);

	return (
		<div>
			<Header searchPlaceholder="Search for an airline..." profile />

			<PageTitle
				title="Airlines"
				subtitle="List of airlines and their IATA codes."
				header
			/>

			<Table className="w-full divide-y divide-neutral-200">
				<TableHeader>
					<TableRow>
						<TableHead>Airline</TableHead>
						<TableHead>IATA Code</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-neutral-200">
					{airlines.map((airline) => (
						<TableRow key={airline.id}>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								<span className="text-sm font-medium text-neutral-900">
									{airline.name}
								</span>
							</TableCell>
							<TableCell>{airline.iata_code}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Pagination totalCount={totalCount} resource="airline" />
		</div>
	);
}
