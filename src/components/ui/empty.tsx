import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Card } from './card';

type EmptyProps = {
	totalCount: number;
	icon: FontAwesomeIconProps;
	title: string;
	description: string;
};

const Empty = ({ icon, title, description, totalCount }: EmptyProps) => {
	if (totalCount > 0) return;

	return <Card>bruh</Card>;
};

export { Empty };
