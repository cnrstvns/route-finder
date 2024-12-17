import { listAirlines } from '@/api/server/airline';
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
import Image from 'next/image';

export default async function Airlines({ searchParams }: PaginatedWithQuery) {
  const { data: airlines } = await listAirlines(searchParams,{ headers: headers()});

  return (
    <div>
      <Header searchPlaceholder="Search for an airline..." profile />

      <PageTitle
        title="Airlines"
        subtitle="List of airlines and their IATA codes."
        header
      />

      <div className="overflow-auto w-screen md:w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Airline</TableHead>
              <TableHead>IATA Code</TableHead>
              <TableHead>Route Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {airlines.data.map((airline) => (
              <TableRow key={airline.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                  <Image src={airline.logoPath} alt={airline.name} width={32} height={32} className="rounded-full" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-zinc-200">
                    {airline.name}
                  </span>
                  </div>
                </TableCell>
                <TableCell>{airline.iataCode}</TableCell>
                <TableCell>{airline.routeCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination totalCount={airlines.pagination.totalCount} hasMore={airlines.pagination.hasMore} resource="airline" />
    </div>
  );
}
