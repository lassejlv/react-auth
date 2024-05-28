import { UserModel } from "@/schemas/user";
import { Context } from "probun";
import redis from "@/utils/redis";

export async function PUT(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { username, token } = await req.json();
    if (!username || !token) throw new Error("Invalid data");

    const validSession = await redis.get(`session:${token}`);
    if (!validSession) throw new Error("Invalid session");

    const { user } = JSON.parse(validSession);
    const userData = await UserModel.findById(user);
    if (!userData) throw new Error("User not found");

    userData.username = username;
    await userData.save();

    return c.json({ message: "Username updated successfully" });
  } catch (error: any) {
    return c.error(error.message);
  }
}
