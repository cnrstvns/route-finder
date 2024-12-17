import { HonoGenerics } from '../types';
import { OpenAPIHono } from '@hono/zod-openapi';
import { route } from '../lib/openapi';
import { authMiddleware } from '../middleware/auth';
import { UserSchema } from '../schemas/auth';

export const authRouter = new OpenAPIHono<HonoGenerics>().openapi(
  route
    .get('/session')
    .returns(UserSchema)
    .setOperationId('retrieveSession')
    .setTags(['auth'])
    .setMiddleware(authMiddleware(false))
    .build(),
  async (c) => {
    return c.json(c.var.user, 200);
  },
);
