import { redis } from '@/lib/redis';

type Result = {
	limit: number;
	remaining: number;
	success: boolean;
	getHeaders: () => {
		'X-RateLimit-Limit': string;
		'X-RateLimit-Remaining': string;
	};
};

const rateLimit = async (
	ip: string,
	limit: number,
	duration: number,
): Promise<Result> => {
	const key = `rate_limit:${ip}`;
	const currentCount = await redis.get(key);
	const count = parseInt(currentCount as string, 10) || 0;

	if (count >= limit) {
		return {
			limit,
			remaining: limit - count,
			success: false,
			getHeaders: () => {
				return {
					'X-RateLimit-Limit': limit.toString(),
					'X-RateLimit-Remaining': (limit - count).toString(),
				};
			},
		};
	}

	redis.incr(key);
	redis.expire(key, duration);

	return {
		limit,
		remaining: limit - (count + 1),
		success: true,
		getHeaders: () => {
			return {
				'X-RateLimit-Limit': limit.toString(),
				'X-RateLimit-Remaining': (limit - (count + 1)).toString(),
			};
		},
	};
};

export { rateLimit };
