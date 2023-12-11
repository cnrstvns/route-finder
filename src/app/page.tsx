import { PageTitle } from '@/components/ui/page-title';
import { db, airline, route } from '@/db';
import { sql } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';

type Airline = {
  id: string;
  name: string;
  slug: string;
  logo_path: string;
  route_count: string;
};

export default async function Home() {
  const query = sql`select a.id, a.name, a.slug, a.logo_path, count(r.id) as route_count from ${airline} a join ${route} r on r.airline_iata = a.iata_code group by a.id, a.name;`;
  const results = await db.execute(query);
  const airlines = results.rows as Airline[];

  return (
    <div>
      <PageTitle
        title="Home"
        subtitle="Where will we fly today? To get started, choose an airline."
        className="mt-4"
      />

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {airlines.map((airline) => (
          <AirlineCard key={airline.id} airline={airline} />
        ))}
      </div>
    </div>
  );
}

async function AirlineCard({ airline }: { airline: Airline }) {
  return (
    <Link
      href={`/new/${airline.slug}`}
      className="border flex space-x-3 rounded-md shadow-sm py-4 px-4 hover:shadow-md transition-all duration-250"
    >
      <div className="flex flex-col h-full justify-center">
        <Image
          className="rounded-full"
          src={`/logos/${airline.logo_path}`}
          alt={airline.name}
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-semibold">{airline.name}</div>
        <div className="text-gray-500">{airline.route_count} routes</div>
      </div>
    </Link>
  );
}
