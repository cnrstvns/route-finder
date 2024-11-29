import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  emailAddress: z.string(),
  profilePictureUrl: z.string().nullable(),
  admin: z.boolean(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
