import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatMinutes = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	const hoursString = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
	const minutesString =
		remainingMinutes > 0
			? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
			: '';

	const separator = hoursString && minutesString ? ' ' : '';

	return hoursString + separator + minutesString;
};

export { dayjs };
