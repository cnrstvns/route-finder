import { db, route as routeTable } from '@/db';

type PageParams = {
	searchParams: {
		routeId: string;
	};
};

export default function Page({ searchParams }: PageParams) {
	const route = db.query.;

	return <div>this page is about route {searchParams.routeId}</div>;
}
