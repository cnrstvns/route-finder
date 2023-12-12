import { PageTitle } from '@/components/ui/page-title';
import { Search } from '@/components/ui/search';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { aircraft, db } from '@/db';
import { ilike, or } from 'drizzle-orm';

type PageParams = { searchParams: { q: string } };

export default async function Aircraft({ searchParams }: PageParams) {
	const aircrafts = await db
		.select()
		.from(aircraft)
		.where(
			searchParams.q
				? or(
						ilike(aircraft.modelName, `%${searchParams.q}%`),
						ilike(aircraft.iataCode, `%${searchParams.q}%`),
				  )
				: undefined,
		);

	return (
		<div>
			<div className='w-full z-50 fixed top-0 flex items-center px-4 bg-gray-50 h-[60px] border-b'>
				<Search placeholder='Search for an aircraft...' />
			</div>

			<PageTitle
				title='Aircraft'
				subtitle='List of aircraft and their IATA codes.'
				className='pt-4 mt-[60px]'
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Aircraft</TableHead>
						<TableHead>IATA Code</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{aircrafts.map((aircraft) => (
						<TableRow key={aircraft.id}>
							<TableCell>
								<div className='flex items-center'>
									<div className='text-sm font-medium text-gray-900'>
										{aircraft.modelName}
									</div>
								</div>
							</TableCell>
							<TableCell>{aircraft.iataCode}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
