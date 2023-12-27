'use client';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/trpc';
import { useCallback } from 'react';
import { RouterOutputs } from '@/server/routers/_app';
import { faBookmark as faBookmarkRegular } from '@fortawesome/pro-regular-svg-icons/faBookmark';
import { faBookmark as faBookmarkSolid } from '@fortawesome/pro-solid-svg-icons/faBookmark';

type InitialData = RouterOutputs['userRoute']['fetchById'];
type SaveRouteProps = {
	routeId: number;
	initialData: InitialData;
};

const SaveRoute = ({ routeId, initialData }: SaveRouteProps) => {
	const utils = trpc.useUtils();
	const { data } = trpc.userRoute.fetchById.useQuery(
		{ routeId },
		{
			initialData,
		},
	);

	const { mutateAsync, isLoading } =
		trpc.userRoute.toggleRouteSaved.useMutation({
			onSettled: () => utils.userRoute.fetchById.invalidate({ routeId }),
		});

	const handleSave = useCallback(async () => {
		await mutateAsync({ routeId });
	}, [mutateAsync, routeId]);

	return (
		<Button
			type="button"
			variant="secondary"
			size="md"
			onClick={handleSave}
			loading={isLoading}
			icon={data.route ? faBookmarkSolid : faBookmarkRegular}
		>
			{data.route ? 'Unsave' : 'Save'}
		</Button>
	);
};

export { SaveRoute };
