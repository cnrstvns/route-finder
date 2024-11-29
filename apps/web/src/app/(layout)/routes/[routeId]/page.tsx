import { Header } from '@/components/navigation/header';
import { SaveRoute } from '@/components/routes/save-route';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRow,
  CardTitle,
} from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import {
  aircraft as aircraftTable,
  db,
  route as routeTable,
  userRoute as userRouteTable,
} from '@/db';
import { distanceInNauticalMiles } from '@/lib/distance';
import { formatElevation } from '@/lib/elevation';
import { generateFlightNumber } from '@/lib/flight-number';
import { currentUser } from '@/lib/get-user';
import { formatMinutes } from '@/lib/time';
import { faMap } from '@fortawesome/pro-solid-svg-icons/faMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { and, eq, like, or, sql } from 'drizzle-orm';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import type { RouteResult } from './types';

const Preview = dynamic(() => import('./preview'), {
  ssr: false,
  loading: () => <></>,
});

type PageParams = {
  params: {
    routeId: string;
  };
};

type AircraftResult = {
  id: number;
  iata_code: string;
  model_name: string;
  short_name: string;
};

export default async function Page({ params }: PageParams) {
  const user = await currentUser();

  const query = sql`
		SELECT
			route.id,
			route.average_duration,
			route.aircraft_codes,
		FROM
			route
		JOIN
			airline on route.airline_iata = airline.iata_code
		JOIN
			airport as origin_airport on route.origin_iata = origin_airport.iata_code
		JOIN
			airport as destination_airport on route.destination_iata = destination_airport.iata_code
		WHERE
			${eq(routeTable.id, parseInt(params.routeId))};
	`;

  const result = await db.execute<RouteResult>(query);
  const route = result.rows[0];

  const parsedAircraft = route.aircraft_codes.split(',');
  const aircraftWhere = parsedAircraft.map((a) =>
    like(aircraftTable.iataCode, `%${a}%`),
  );
  const aircraftQuery = sql`
		SELECT
			*
		FROM
			aircraft
		WHERE
			${or(...aircraftWhere)};
	`;
  const aircraftResult = await db.execute<AircraftResult>(aircraftQuery);
  const aircraft = aircraftResult.rows;

  const flightNumber = generateFlightNumber(route.airline_iata);
  const distanceInNm = distanceInNauticalMiles(
    route.origin_latitude,
    route.origin_longitude,
    route.destination_latitude,
    route.destination_longitude,
  );

  const [userRoute] = await db
    .select()
    .from(userRouteTable)
    .where(
      and(
        eq(userRouteTable.routeId, route.id),
        eq(userRouteTable.userId, user.id),
      ),
    );

  return (
    <div>
      <Header profile />
      <PageTitle
        title={`Today's flight to ${route.destination_city}`}
        subtitle={`${flightNumber} from ${route.origin_city} to ${route.destination_city}`}
        header
      >
        <SaveRoute
          routeId={route.id}
          initialData={{ success: true, route: userRoute }}
        />
      </PageTitle>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-4 gap-4 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Origin</CardTitle>
            <CardDescription>
              Information about your flight's origin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardRow label="Airport Name" value={route.origin_name} />
            <CardRow label="IATA Code" value={route.origin_iata} copyable />
            <CardRow label="ICAO Code" value={route.origin_icao} copyable />
            <CardRow label="City" value={route.origin_city} />
            <CardRow label="Country" value={route.origin_country} />
            <CardRow
              label="Elevation"
              value={formatElevation(route.origin_elevation)}
              copyable
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
            <CardDescription>
              Information about your flight's destination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardRow label="Airport Name" value={route.destination_name} />
            <CardRow
              label="IATA Code"
              value={route.destination_iata}
              copyable
            />
            <CardRow
              label="ICAO Code"
              value={route.destination_icao}
              copyable
            />
            <CardRow label="City" value={route.destination_city} />
            <CardRow label="Country" value={route.destination_country} />
            <CardRow
              label="Elevation"
              value={formatElevation(route.destination_elevation)}
              copyable
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipment</CardTitle>
            <CardDescription>
              Information about your flight's equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aircraft.map((ac) => (
              <div
                key={ac.id}
                className="py-2 border-b dark:border-white/10 last-of-type:border-0"
              >
                <div className="font-medium text-lg">{ac.model_name}</div>
                <CardRow
                  key={ac.id}
                  label="IATA Code"
                  value={ac.iata_code}
                  copyable
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              Technical details about your flight
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardRow label="Airline" value={route.airline_name} />
            <CardRow label="Flight Number" value={flightNumber} copyable />
            <CardRow
              label="Average Duration"
              value={formatMinutes(route.average_duration)}
            />
            <CardRow label="Distance (Direct)" value={`${distanceInNm} nm`} />
            <CardRow
              label="Domestic/International"
              value={
                route.origin_country === route.destination_country
                  ? 'Domestic'
                  : 'International'
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>
              Open this flight in your flight planning software
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex space-y-3 md:space-y-0 flex-col md:flex-row space-x-0 md:space-x-2">
            <Link
              href={`https://www.simbrief.com/system/dispatch.php?orig=${route.origin_icao}&dest=${route.destination_icao}`}
              target="_blank"
              className="flex items-center w-full"
            >
              <Button variant="black" size="md" className="w-full">
                Open in Simbrief
                <Image
                  src="/external/navigraph.png"
                  height={20}
                  width={20}
                  alt="Navigraph"
                  className="ml-2"
                />
              </Button>
            </Link>

            <Link
              href={`https://skyvector.com?fpl=${route.origin_icao}%20${route.destination_icao}`}
              target="_blank"
              className="w-full"
            >
              <Button variant="black" size="md" className="w-full">
                Open in SkyVector
                <FontAwesomeIcon icon={faMap} className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Preview of your flight's route</CardDescription>
          </CardHeader>

          <CardContent className="flex space-y-3 md:space-y-0 flex-col md:flex-row space-x-0 md:space-x-2">
            <Preview route={route} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
