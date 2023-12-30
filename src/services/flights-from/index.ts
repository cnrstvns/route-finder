import fetch from 'node-fetch';
import type { Route } from './types';

export const getRoutes = async (iataCode: string) => {
	const response = await fetch(
		`https://www.flightsfrom.com/api/airline/${iataCode}`,
		{
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				pragma: 'no-cache',
				'sec-ch-ua': '"Chromium";v="119", "Not?A_Brand";v="24"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'x-xsrf-token':
					'eyJpdiI6Ilg2VHkwMkxqeVlFSGkycEExMjlOUHc9PSIsInZhbHVlIjoidFk3RFM1WDluK3BKY2Z3MzBcLzlDd1VkUDhldldoQVYrN2pRdEhkUWhjWVp2eUd2NXBvU0ZTVTZUeFh1XC9FMyt3ZWxsQzNTSVhqTjFXVW5QVEZqWGRVQT09IiwibWFjIjoiYWFiNjYwNTBlN2IyM2UyMTBkMDM1MTVlYjE4YzgzZTQ0YzA5NDA4OWIwN2EwNzNjZDZhMWRiYTE5Yjg1NmE3NiJ9',
				cookie:
					'nad=1; unad=XseVY0wEfEFvpRYEtTqDx4KQ2YZC2i4y; XSRF-TOKEN=eyJpdiI6Ilg2VHkwMkxqeVlFSGkycEExMjlOUHc9PSIsInZhbHVlIjoidFk3RFM1WDluK3BKY2Z3MzBcLzlDd1VkUDhldldoQVYrN2pRdEhkUWhjWVp2eUd2NXBvU0ZTVTZUeFh1XC9FMyt3ZWxsQzNTSVhqTjFXVW5QVEZqWGRVQT09IiwibWFjIjoiYWFiNjYwNTBlN2IyM2UyMTBkMDM1MTVlYjE4YzgzZTQ0YzA5NDA4OWIwN2EwNzNjZDZhMWRiYTE5Yjg1NmE3NiJ9; laravel_session=eyJpdiI6ImF3VTU5RkN2VzNFY0VudVA0cUQ1eUE9PSIsInZhbHVlIjoiVXVCUHE3eDVqMGhSalZhXC96c2VVV1hWMHd5S2ZcLzJrVUNLdjJNQW40NUt6NmkwWmpBVU82Rm5YUG50VXF5SXVhMUx3WDNZOE4yeUVHTFwvcGx3bFpXTmc9PSIsIm1hYyI6IjQxYjUzNGJlYjAxM2U3MjhlODNmNjBhMzdhOGUzMGMwMGU1OWIwYWYyOWZmMzQ0MjU4NzZiYTczYzBhZGYxYTMifQ%3D%3D',
				Referer: 'https://www.flightsfrom.com/BA',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
			},
			body: null,
			method: 'GET',
		},
	)
		.then((response) => response.json())
		.catch(() => null);

	if (!response) return null;

	// @ts-expect-error
	const routes = response.routes as Route[];

	return routes;
};
