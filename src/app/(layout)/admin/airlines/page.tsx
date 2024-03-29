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
import { api } from '@/server/api';
import { PaginatedWithQuery } from '@/types/search';
import { AddAirline } from './add-airline';

export default async function Airlines({ searchParams }: PaginatedWithQuery) {
  const { data: airlines, totalCount } =
    await api.airline.list.query(searchParams);

  return (
    <div>
      <Header searchPlaceholder="Search for an airline..." profile />

      <PageTitle
        title="Airlines"
        subtitle="Add and perform updates on airlines."
        header
      >
        <AddAirline />
      </PageTitle>

      <div className="overflow-auto w-screen md:w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Airline</TableHead>
              <TableHead>IATA Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {airlines.map((airline) => (
              <TableRow key={airline.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-neutral-900 dark:text-zinc-200">
                    {airline.name}
                  </span>
                </TableCell>
                <TableCell>{airline.iataCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination totalCount={totalCount} resource="airline" />
    </div>
  );
}
