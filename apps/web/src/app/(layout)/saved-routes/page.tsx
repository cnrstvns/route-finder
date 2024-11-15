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
import { PaginatedWithQuery } from '@/types/search';
import { Row } from './row';
import { listUserRoutes } from '@/api/server/user-route';
import { headers } from 'next/headers';

export default async function SavedRoutes({
  searchParams,
}: PaginatedWithQuery) {
  const { data: savedRoutes } = await listUserRoutes(searchParams, { headers: headers() })

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
            {savedRoutes.data.map((route) => (
              <Row key={route.user_route.id} route={route} />
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalCount={savedRoutes.pagination.totalCount}
        hasMore={savedRoutes.pagination.hasMore}
        resource="saved route"
      />
    </div>
  );
}
