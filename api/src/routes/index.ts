import { Context } from "probun";

export async function GET(req: Request): Promise<Response> {
  const c = Context(req);

  return c.success("Hello, World!");
}
