import { PageTitle } from '@/components/ui/page-title';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from '@/components/ui/table';
import { airport, db, route } from '@/db';
import { and, eq, gte, like, lte, or } from 'drizzle-orm';
import { formatMinutes } from '@/lib/time';
import { alias } from 'drizzle-orm/pg-core';

type PageParams = {
  searchParams: {
    maxDuration: string;
    minDuration: string;
    aircraft: string;
    airline: string;
  };
};

export default async function Routes({ searchParams }: PageParams) {
  const aircraftWhere = searchParams.aircraft
    .split(',')
    .map((a) => like(route.aircraftCodes, `%${a}%`));

  const originAlias = alias(airport, 'origin');
  const destinationAlias = alias(airport, 'destination');

  const routes = await db
    .select()
    .from(route)
    .orderBy(route.averageDuration)
    .where(
      and(
        eq(route.airlineIata, searchParams.airline),
        lte(route.averageDuration, +searchParams.maxDuration),
        gte(route.averageDuration, +searchParams.minDuration),
        or(...aircraftWhere),
      ),
    )
    .leftJoin(originAlias, eq(originAlias.iataCode, route.originIata))
    .leftJoin(
      destinationAlias,
      eq(destinationAlias.iataCode, route.destinationIata),
    );

  return (
    <div>
      <div className="mt-4">
        <PageTitle
          title={`${routes.length} Routes Found`}
          subtitle="Pick a route, and get to flying!"
        />
      </div>

      <div className="w-screen overflow-scroll lg:w-[calc(100vw-250px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avg Duration</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Equipment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((r) => (
              <TableRow key={r.route.id}>
                <TableCell>{formatMinutes(r.route.averageDuration)}</TableCell>
                <TableCell>
                  {r.origin?.name} ({r.origin?.iataCode})
                </TableCell>
                <TableCell>
                  {r.destination?.name} ({r.destination?.iataCode})
                </TableCell>
                <TableCell>
                  {r.route.aircraftCodes.replace(',', ', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
