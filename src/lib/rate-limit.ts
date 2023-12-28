import { redis } from '@/lib/redis';

type Result = {
	limit: number;
	remaining: number;
	success: boolean;
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
		};
	}

	redis.incr(key);
	redis.expire(key, duration);

	return {
		limit,
		remaining: limit - (count + 1),
		success: true,
	};
};

export { rateLimit };
