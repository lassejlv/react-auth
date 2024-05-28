import { UserModel } from "@/schemas/user";
import { Context } from "probun";

export async function POST(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { username, password } = await c.req.json();

    if (!username || !password) throw new Error("Email and password are required");

    const userData = await UserModel.findOne({ username });
    if (userData) throw new Error("User already exists");

    const hashedPassword = await Bun.password.hashSync(password);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    return c.json({ message: "User created" });
  } catch (error: any) {
    return c.error(error.message);
  }
}
