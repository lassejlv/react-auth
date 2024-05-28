import { UserModel } from "@/schemas/user";
import type { Session } from "@/types/user";
import redis from "@/utils/redis";
import { Context } from "probun";

export async function POST(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { token } = await c.req.json();
    if (!token) throw new Error("Token is required");

    const session = await redis.get(`session:${token}`);
    if (!session) throw new Error("Invalid token");

    const parsedSession: Session = JSON.parse(session);
    if (parsedSession.ex < Date.now()) throw new Error("Token expired");

    const userData = await UserModel.findById(parsedSession.user);
    if (!userData) throw new Error("User not found");

    return c.json({ message: "Pong", data: { username: userData.username } });
  } catch (error: any) {
    return c.error(error.message);
  }
}
