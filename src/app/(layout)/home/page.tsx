import { Header } from '@/components/navigation/header';
import { Empty } from '@/components/ui/empty';
import { PageTitle } from '@/components/ui/page-title';
import { api } from '@/server/api';
import { RouterOutputs } from '@/server/routers/_app';
import { SearchWithQuery } from '@/types/search';
import { currentUser } from '@clerk/nextjs';
import { faSeatAirline } from '@fortawesome/pro-solid-svg-icons/faSeatAirline';
import Image from 'next/image';
import Link from 'next/link';

type Airline =
  RouterOutputs['airline']['listWithRouteCount']['data'][number]['airline'];

export default async function Home({ searchParams }: SearchWithQuery) {
  const user = await currentUser();
  const { data: rows } =
    await api.airline.listWithRouteCount.query(searchParams);

  return (
    <div>
      <Header searchPlaceholder="Search for an airline..." profile />

      <PageTitle
        title={`Welcome back, ${user?.firstName || 'aviator'}`}
        subtitle="Where will we fly today? To get started, choose an airline."
        header
      />

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 dark:bg-zinc-900">
        {rows.map((row) => (
          <AirlineCard key={row.airline.id} airline={row.airline} />
        ))}
      </div>
      {!rows.length && (
        <Empty
          icon={faSeatAirline}
          title="No airlines found"
          subtitle="Try changing your search criteria"
          className="mx-8"
        />
      )}
    </div>
  );
}

async function AirlineCard({ airline }: { airline: Airline }) {
  return (
    <Link
      href={`/new/${airline.slug}`}
      className="border flex space-x-3 rounded-md shadow-sm py-4 px-4 hover:shadow-md hover:bg-neutral-50 dark:hover:bg-zinc-800/50 cursor-default dark:border-white/10"
    >
      <div className="flex flex-col h-full justify-center">
        <Image
          className="rounded-full object-cover h-12"
          src={airline.logoPath}
          alt={airline.name}
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col h-full justify-center">
        <div className="text-xl font-semibold dark:text-zinc-200">
          {airline.name}
        </div>
        <div className="text-neutral-500 dark:text-zinc-400">
          {airline.routeCount} routes
        </div>
      </div>
    </Link>
  );
}
