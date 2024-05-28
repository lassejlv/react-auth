import { UserModel } from "@/schemas/user";
import { env } from "@/utils/env";
import redis from "@/utils/redis";
import { Context, param } from "probun";

export async function GET(req: Request): Promise<Response> {
  const c = Context(req);
  const id = await param(req);

  try {
    const request = await redis.get(`email:${id}`);
    if (!request) throw new Error("Invalid request");

    const { email, user } = JSON.parse(request);
    const userData = await UserModel.findById(user);

    if (!userData) throw new Error("User not found");

    userData.email = email;
    userData.email_verified = true;
    await userData.save();

    await redis.del(`email:${id}`);

    return c.redirect(`${env.FRONTEND_URL}/dashboard?verified=true`);
  } catch (error: any) {
    await redis.del(`email:${id}`);
    return c.error(error.message);
  }
}
