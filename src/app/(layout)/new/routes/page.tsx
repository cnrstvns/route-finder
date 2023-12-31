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
import { Paginated } from '@/types/search';
import { Row } from './row';

type PageParams = Paginated & {
	searchParams: {
		maxDuration: string;
		minDuration: string;
		aircraft: string;
		airline: string;
	};
};

export default async function Routes({ searchParams }: PageParams) {
	const routes = await api.route.search.query(searchParams);

	return (
		<div>
			<Header profile />

			<PageTitle
				title={`${routes.totalCount} Routes Found`}
				subtitle="Pick a route, and get to flying!"
				header
			/>

			<div className="overflow-auto w-screen md:w-full">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Origin</TableHead>
							<TableHead>Destination</TableHead>
							<TableHead>Average Duration</TableHead>
							<TableHead>Equipment</TableHead>
							<TableHead>{''}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{routes.data.map((r) => (
							<Row key={r.id} route={r} />
						))}
					</TableBody>
				</Table>
			</div>
			<Pagination totalCount={routes.totalCount} resource="route" />
		</div>
	);
}
