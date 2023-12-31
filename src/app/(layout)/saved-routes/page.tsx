import { Header } from '@/components/navigation/header';
import { PageTitle } from '@/components/ui/page-title';
import { Pagination } from '@/components/ui/pagination';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { api } from '@/server/api';
import { PaginatedWithQuery } from '@/types/search';
import { Row } from './row';

export default async function SavedRoutes({
	searchParams,
}: PaginatedWithQuery) {
	const { totalCount, data: savedRoutes } =
		await api.userRoute.listSavedRoutes.query(searchParams);

	return (
		<div>
			<Header searchPlaceholder="Search for a route..." profile />

			<PageTitle
				title="Saved Routes"
				subtitle="List of routes you've saved for later."
				header
			/>

			<div className="overflow-auto w-screen md:w-full">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Origin</TableHead>
							<TableHead>Destination</TableHead>
							<TableHead>Airline</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Aircraft</TableHead>
							<TableHead>Saved</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="bg-white">
						{savedRoutes.map((route) => (
							<Row key={route.user_route.id} route={route} />
						))}
					</TableBody>
				</Table>
			</div>
			<Pagination totalCount={totalCount} resource="saved route" />
		</div>
	);
}
