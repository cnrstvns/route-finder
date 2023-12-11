import { PageTitle } from '@/components/ui/page-title';
import { aircraft, airline as airlineTable, db } from '@/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { RouteForm } from './form';

type PageParams = { params: { airlineId: string } };

export default async function NewFlight({ params }: PageParams) {
  const airlineResults = await db
    .select()
    .from(airlineTable)
    .where(eq(airlineTable.slug, params.airlineId));
  const airline = airlineResults[0];

  // TODO: make it so that only aircraft that this airline flies uses
  const aircraftResults = await db.select().from(aircraft);

  if (!airline) redirect('/');

  return (
    <div>
      <div className="mt-4">
        <PageTitle
          title={`New ${airline.name} Flight`}
          subtitle="Choose how long you'd like to fly, and on what equipment. We'll do the rest."
        />
      </div>

      <RouteForm airline={airline.iataCode} aircraft={aircraftResults} />
    </div>
  );
}
