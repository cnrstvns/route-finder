import { createRoute } from '@hono/zod-openapi';
import type { AnyZodObject, ZodSchema } from 'zod';
import type { MiddlewareHandler } from 'hono/types';
import type { HonoGenerics } from '../types';

export const route = {
  get: <Path extends string>(path: Path) => makeRoute('get', path),
  put: <Path extends string>(path: Path) => makeRoute('put', path),
  post: <Path extends string>(path: Path) => makeRoute('post', path),
  delete: <Path extends string>(path: Path) => makeRoute('delete', path),
  patch: <Path extends string>(path: Path) => makeRoute('patch', path),
} as const;

function makeRoute<Path extends string, Method extends RequestMethod>(
  method: Method,
  path: Path,
) {
  return new RouteSchema(method, path);
}

type RequestMethod = 'get' | 'put' | 'post' | 'delete' | 'patch';

class RouteSchema<
  Path extends string,
  Method extends RequestMethod,
  Return extends ZodSchema | undefined = undefined,
  Body extends ZodSchema | undefined = undefined,
  Params extends AnyZodObject | undefined = undefined,
  Query extends AnyZodObject | undefined = undefined,
> {
  private path: Path;
  private method: Method;
  private returnSchema: Return | undefined = undefined;
  private bodySchema: Body | undefined = undefined;
  private paramsSchema: Params | undefined = undefined;
  private querySchema: Query | undefined = undefined;
  private tags: string[] | undefined = undefined;
  private operationId: string | undefined = undefined;
  private middleware: MiddlewareHandler<HonoGenerics> | undefined = undefined;

  constructor(method: Method, path: Path) {
    this.method = method;
    this.path = path;
  }

  public returns<R extends ZodSchema>(returnSchema: R) {
    this.returnSchema = returnSchema as any;
    return this as unknown as RouteSchema<Path, Method, R, Body, Params, Query>;
  }

  public body<B extends ZodSchema>(body: B) {
    this.bodySchema = body as any;
    return this as unknown as RouteSchema<
      Path,
      Method,
      Return,
      B,
      Params,
      Query
    >;
  }

  public params<P extends AnyZodObject>(params: P) {
    this.paramsSchema = params as any;
    return this as unknown as RouteSchema<Path, Method, Return, Body, P, Query>;
  }

  public query<Q extends AnyZodObject>(query: Q) {
    this.querySchema = query as any;
    return this as unknown as RouteSchema<
      Path,
      Method,
      Return,
      Body,
      Params,
      Q
    >;
  }

  public setTags(tags: string[]) {
    this.tags = tags;
    return this as unknown as RouteSchema<
      Path,
      Method,
      Return,
      Body,
      Params,
      Query
    >;
  }

  public setOperationId(id: string) {
    this.operationId = id;
    return this as unknown as RouteSchema<
      Path,
      Method,
      Return,
      Body,
      Params,
      Query
    >;
  }

  public setMiddleware(middleware: MiddlewareHandler<HonoGenerics>) {
    this.middleware = middleware;
    return this as unknown as RouteSchema<
      Path,
      Method,
      Return,
      Body,
      Params,
      Query
    >;
  }

  public build() {
    const responseCode = this.method === 'post' ? 201 : 200;
    const body = (
      this.bodySchema
        ? {
            content: { 'application/json': { schema: this.bodySchema } },
            required: true as const,
          }
        : undefined
    ) as Body extends undefined
      ? undefined
      : {
          content: { 'application/json': { schema: Body } };
          required: true;
        };

    const returnType = (
      this.returnSchema
        ? {
            'application/json': { schema: this.returnSchema },
          }
        : undefined
    ) as Return extends undefined
      ? undefined
      : {
          'application/json': { schema: Return };
        };

    const schema = {
      path: this.path,
      method: this.method,
      tags: this.tags,
      operationId: this.operationId,
      request: {
        body,
        params: this.paramsSchema as Params,
        query: this.querySchema as Query,
      },
      responses: {
        [responseCode]: {
          content: returnType,
          description: 'The resource',
        },
      },
      middleware: this.middleware,
    } as const;

    return createRoute(schema);
  }
}
