import { airline } from '@/db';
import { inngest } from '@/lib/inngest';
import { adminProcedure, router } from '@/server/trpc';
import { getRoutes } from '@/services/flights-from';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const airlineRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        iataCode: z
          .string()
          .length(2)
          .transform((ic) => ic.toUpperCase()),
        slug: z.string().transform((s) => s.toLowerCase()),
        logoPath: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existingAirline] = await ctx.db
        .select()
        .from(airline)
        .where(eq(airline.iataCode, input.iataCode));

      if (existingAirline) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Airline already exists.',
        });
      }

      const apiAirline = await getRoutes(input.iataCode);

      if (!apiAirline) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Airline does not exist.',
        });
      }

      await ctx.db.insert(airline).values(input);

      await inngest.send({
        name: 'admin/airline.add',
        data: {
          iataCode: input.iataCode,
        },
      });
    }),
});
