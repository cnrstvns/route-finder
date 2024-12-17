import { listAircraft } from '@/api/server/aircraft';
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
import { PaginatedWithQuery } from '@/types/search';
import { headers } from 'next/headers';

export default async function Aircraft({ searchParams }: PaginatedWithQuery) {
  const { data: aircraft } = await listAircraft(searchParams, { headers: headers() });

  return (
    <div>
      <Header searchPlaceholder="Search for an aircraft..." profile />

      <PageTitle
        title="Aircraft"
        subtitle="List of aircraft and their IATA codes."
        header
      />
      <div className="overflow-auto w-screen md:w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aircraft</TableHead>
              <TableHead>IATA Code</TableHead>
              <TableHead>Short Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aircraft.data.map((aircraft) => (
              <TableRow key={aircraft.id}>
                <TableCell>
                  <span className="text-sm font-medium text-neutral-900 dark:text-zinc-200">
                    {aircraft.modelName}
                  </span>
                </TableCell>
                <TableCell>{aircraft.iataCode}</TableCell>
                <TableCell>{aircraft.shortName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalCount={aircraft.pagination.totalCount}
        hasMore={aircraft.pagination.hasMore}
        resource="aircraft"
      />
    </div>
  );
}
