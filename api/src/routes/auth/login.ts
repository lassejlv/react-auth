import { Context } from "probun";
import { UserModel } from "@/schemas/user";
import crypto from "crypto";
import redis from "@/utils/redis";

export async function POST(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { username, password } = await c.req.json();

    if (!username || !password)
      throw new Error("Email and password are required");

    const userData = await UserModel.findOne({ username });
    if (!userData) throw new Error("User not found");

    const isValidPassword = await Bun.password.verifySync(
      password,
      userData.password
    );
    if (!isValidPassword) throw new Error("Invalid password");

    const token = crypto.randomBytes(64).toString("hex");

    await redis.set(`session:${token}`, JSON.stringify({ user: userData.id }));
    await redis.expire(`session:${token}`, 60 * 60 * 24 * 7); // 7 days

    return c.json({ token });
  } catch (error: any) {
    return c.error(error.message);
  }
}
