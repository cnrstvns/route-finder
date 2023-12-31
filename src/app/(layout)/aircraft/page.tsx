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

export default async function Aircraft({ searchParams }: PaginatedWithQuery) {
  const { data: aircraft, totalCount } =
    await api.aircraft.list.query(searchParams);

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
            {aircraft.map((aircraft) => (
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
      <Pagination totalCount={totalCount} resource="aircraft" />
    </div>
  );
}
