'use client';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { faBookmark as faBookmarkRegular } from '@fortawesome/pro-regular-svg-icons/faBookmark';
import { faBookmark as faBookmarkSolid } from '@fortawesome/pro-solid-svg-icons/faBookmark';
import posthog from 'posthog-js';
import { useCallback } from 'react';
import type { MouseEvent } from 'react';

// type InitialData = RouterOutputs['userRoute']['fetchById'];
type InitialData = {
  route: {
    id: number;
  };
};

type SaveRouteProps = {
  routeId: number;
  initialData: InitialData;
  size?: ButtonProps['size'];
};

const SaveRoute = ({ routeId, initialData, size }: SaveRouteProps) => {
  // const utils = trpc.useUtils();
  // const { data } = trpc.userRoute.fetchById.useQuery(
  //   { routeId },
  //   {
  //     initialData,
  //   },
  // );

  // const { mutateAsync, isLoading } =
  //   trpc.userRoute.toggleRouteSaved.useMutation({
  //     onSettled: () => {
  //       utils.userRoute.fetchById.invalidate({ routeId });
  //       posthog.capture('Toggled route saved');
  //     },
  //   });

  const mutateAsync = async (values: { routeId: number }) => {
    console.log(values);
  };

  const data = {
    route: {
      id: 1,
    },
  };

  const isLoading = false;

  const handleSave = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await mutateAsync({ routeId });
    },
    [mutateAsync, routeId],
  );

  return (
    <Button
      type="button"
      variant="secondary"
      size={size || 'md'}
      onClick={handleSave}
      loading={isLoading}
      icon={data.route ? faBookmarkSolid : faBookmarkRegular}
    >
      {!size?.includes('icon') && (data.route ? 'Unsave' : 'Save')}
    </Button>
  );
};

export { SaveRoute };
