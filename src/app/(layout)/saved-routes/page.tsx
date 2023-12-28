import { Header } from '@/components/navigation/header';
import { PageTitle } from '@/components/ui/page-title';
import { api } from '@/server/api';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Row } from './row';
import { Button } from '@/components/ui/button';
import { faBarsFilter } from '@fortawesome/pro-regular-svg-icons/faBarsFilter';

type PageParams = { searchParams: { q: string; page?: string } };

export default async function SavedRoutes({ searchParams }: PageParams) {
	const { totalCount, data: savedRoutes } =
		await api.userRoute.listSavedRoutes.query({
			q: searchParams.q,
			page: searchParams.page,
		});

	return (
		<div>
			<Header searchPlaceholder="Search for a route..." profile />

			<PageTitle
				title="Saved Routes"
				subtitle="List of routes you've saved for later."
				header
			>
				<Button
					size="icon"
					type="button"
					variant="secondary"
					icon={faBarsFilter}
				/>
			</PageTitle>

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
