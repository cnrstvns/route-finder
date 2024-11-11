type PollResponse = {
  ready: boolean;
};

type PollUser = (id: string | null) => Promise<boolean>;

export const pollUser: PollUser = async (id) => {
  if (!id) return false;

  const response = await fetch(`/api/clerk?id=${id}`);
  const data: PollResponse = await response.json();

  if (data.ready) {
    return true;
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(pollUser(id)), 1000);
  });
};
