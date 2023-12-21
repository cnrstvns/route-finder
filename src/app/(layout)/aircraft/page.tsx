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
import { aircraft, db } from '@/db';
import { PAGE_SIZE } from '@/lib/constants';
import { ilike, or, sql } from 'drizzle-orm';

type PageParams = { searchParams: { q: string; page?: number } };
type AircraftResult = {
	id: number;
	iata_code: string;
	model_name: string;
	short_name: string;
};

export default async function Aircraft({ searchParams }: PageParams) {
	const page = Number(searchParams.page ?? 1);
	const query = db
		.select()
		.from(aircraft)
		.where(
			searchParams.q
				? or(
						ilike(aircraft.modelName, `%${searchParams.q}%`),
						ilike(aircraft.iataCode, `%${searchParams.q}%`),
				  )
				: undefined,
		)
		.orderBy(aircraft.modelName);

	const countQuery = await db.execute<{ count: number }>(
		sql`SELECT count(*) FROM ${query}`,
	);
	const totalCount = countQuery.rows[0].count;

	query.limit(PAGE_SIZE);
	query.offset(page * PAGE_SIZE - PAGE_SIZE);

	const { rows: aircrafts } = await db.execute<AircraftResult>(query);

	return (
		<div>
			<Header searchPlaceholder="Search for an aircraft..." profile />

			<PageTitle
				title="Aircraft"
				subtitle="List of aircraft and their IATA codes."
				header
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Aircraft</TableHead>
						<TableHead>IATA Code</TableHead>
						<TableHead>Short Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{aircrafts.map((aircraft) => (
						<TableRow key={aircraft.id}>
							<TableCell>
								<span className="text-sm font-medium text-neutral-900">
									{aircraft.model_name}
								</span>
							</TableCell>
							<TableCell>{aircraft.iata_code}</TableCell>
							<TableCell>{aircraft.short_name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Pagination totalCount={totalCount} resource="aircraft" />
		</div>
	);
}
