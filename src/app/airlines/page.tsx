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
import { airline, db } from '@/db';
import { ilike, or } from 'drizzle-orm';

type PageParams = { searchParams: { q: string } };

export default async function Airlines({ searchParams }: PageParams) {
	const airlines = await db
		.select()
		.from(airline)
		.where(
			searchParams.q
				? or(
						ilike(airline.name, `%${searchParams.q}%`),
						ilike(airline.iataCode, `%${searchParams.q}%`),
				  )
				: undefined,
		)
		.orderBy(airline.name);

	return (
		<div>
			<div className='w-full flex items-center px-4 bg-gray-100/40 h-[60px] border-b'>
				<Search placeholder='Search for an airline...' />
			</div>

			<div className='mt-4'>
				<PageTitle
					title='Airlines'
					subtitle='List of airlines and their IATA codes.'
				/>
			</div>

			<Table className='w-full divide-y divide-gray-200'>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Airline
						</TableHead>
						<TableHead className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							IATA Code
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className='bg-white divide-y divide-gray-200'>
					{airlines.map((airline) => (
						<TableRow key={airline.id}>
							<TableCell className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='text-sm font-medium text-gray-900'>
										{airline.name}
									</div>
								</div>
							</TableCell>
							<TableCell className='px-6 py-4 whitespace-nowrap'>
								{airline.iataCode}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
