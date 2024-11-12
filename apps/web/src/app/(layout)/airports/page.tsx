import { listAirports } from '@/api/server/airport';
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

export default async function Airports({ searchParams }: PaginatedWithQuery) {
  const { data: airports } = await listAirports(searchParams, { headers: headers() });

  return (
    <div>
      <Header searchPlaceholder="Search for an airport..." profile />

      <PageTitle
        title="Airports"
        subtitle="List of airports and their IATA codes."
        header
      />

      <div className="overflow-auto w-screen md:w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IATA Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {airports.data.map((airport) => (
              <TableRow key={airport.id}>
                <TableCell>
                  <div className="text-sm font-medium text-neutral-900 dark:text-zinc-200">
                    {airport.iataCode}
                  </div>
                </TableCell>
                <TableCell>{airport.name}</TableCell>
                <TableCell>{airport.city}</TableCell>
                <TableCell>{airport.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalCount={airports.pagination.totalCount}
        hasMore={airports.pagination.hasMore}
        resource="airport"
      />
    </div>
  );
}
