import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { addAirline } from '@/workers/add-airline';

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [addAirline],
});
