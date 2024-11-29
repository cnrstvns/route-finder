import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';

export function assert(
  condition: any,
  code?: StatusCode,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new HTTPException(code ?? 500, message ? { message } : undefined);
  }
}
