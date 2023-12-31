'use client';
import { trpc } from '@/app/_trpc/trpc';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import type { RouterOutputs } from '@/server/routers/_app';
import { faBookmark as faBookmarkRegular } from '@fortawesome/pro-regular-svg-icons/faBookmark';
import { faBookmark as faBookmarkSolid } from '@fortawesome/pro-solid-svg-icons/faBookmark';
import posthog from 'posthog-js';
import { useCallback } from 'react';
import type { MouseEvent } from 'react';

type InitialData = RouterOutputs['userRoute']['fetchById'];
type SaveRouteProps = {
  routeId: number;
  initialData: InitialData;
  size?: ButtonProps['size'];
};

const SaveRoute = ({ routeId, initialData, size }: SaveRouteProps) => {
  const utils = trpc.useUtils();
  const { data } = trpc.userRoute.fetchById.useQuery(
    { routeId },
    {
      initialData,
    },
  );

  const { mutateAsync, isLoading } =
    trpc.userRoute.toggleRouteSaved.useMutation({
      onSettled: () => {
        utils.userRoute.fetchById.invalidate({ routeId });
        posthog.capture('Toggled route saved');
      },
    });

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
