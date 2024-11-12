import { PageTitle } from '@/components/ui/page-title';
import { redirect } from 'next/navigation';
import { RouteForm } from './form';

type PageParams = { params: { airlineId: string } };

export default function NewFlight({ params }: PageParams) {
  // const { airline, aircraft } = await api.airline.newFlight.query(params);

  const airline = {
    name: 'Airline',
    iataCode: 'AL',
  };
  const aircraft = [];

  if (!airline) redirect('/');

  return (
    <div>
      <PageTitle
        title={`New ${airline.name} Flight`}
        subtitle="Choose how long you'd like to fly, and on what equipment. We'll do the rest."
      />

      <RouteForm airline={airline.iataCode} aircraft={aircraft} />
    </div>
  );
}
