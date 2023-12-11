import { PageTitle } from '@/components/ui/page-title';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table';
import { db, aircraft } from '@/db';

export default async function Aircraft() {
  const aircrafts = await db.select().from(aircraft);

  return (
    <div>
      <PageTitle
        title="Aircraft"
        subtitle="List of aircraft and their IATA codes."
        className="pt-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aircraft</TableHead>
            <TableHead>IATA Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aircrafts.map((aircraft) => (
            <TableRow key={aircraft.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {aircraft.modelName}
                  </div>
                </div>
              </TableCell>
              <TableCell>{aircraft.iataCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
