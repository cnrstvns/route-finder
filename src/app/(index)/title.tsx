'use client';
import { PageTitle } from '@/components/ui/page-title';
import { useUser } from '@clerk/nextjs';

const Title = () => {
	const { user } = useUser();

	return (
		<PageTitle
			title={`Welcome back${user ? `, ${user.firstName}` : ''}`}
			subtitle="Where will we fly today? To get started, choose an airline."
			className="mt-4"
		/>
	);
};

export { Title };
