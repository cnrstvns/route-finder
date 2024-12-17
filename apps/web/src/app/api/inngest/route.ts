import { inngest } from '@/lib/inngest';
import { addAirline } from '@/workers/add-airline';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [addAirline],
});
