import { db, route as routeTable } from '@/db';

type PageParams = {
	searchParams: {
		routeId: string;
	};
};

export default function Page({ searchParams }: PageParams) {
	return <div>this page is about route {searchParams.routeId}</div>;
}
