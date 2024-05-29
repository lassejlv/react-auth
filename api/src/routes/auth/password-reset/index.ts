import { UserModel } from "@/schemas/user";
import { env } from "@/utils/env";
import redis from "@/utils/redis";
import { resend } from "@/utils/sendMail";
import { Context } from "probun";

export async function GET(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const token = c.query.get("token");
    if (!token) throw new Error("Invalid request");

    const data = await redis.get(`password-reset:${token}`);
    if (!data) throw new Error("Invalid token");

    return c.json({ success: true });
  } catch (error: any) {
    return c.error(error.message);
  }
}

export async function POST(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { email } = await c.req.json();
    if (!email) throw new Error("Invalid request");

    const userData = await UserModel.findOne({ email });
    if (!userData) throw new Error("User not found");

    // Send the verification email
    const passwordResetToken = crypto.randomUUID();
    await redis.set(
      `password-reset:${passwordResetToken}`,
      JSON.stringify({ email, user: userData.id }),
      "EX",
      60 * 60 * 24
    );

    const { error } = await resend.emails.send({
      from: "react-auth@mails.lassejlv.dk",
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${env.FRONTEND_URL}/reset-password?token=${passwordResetToken}`,
    });

    if (error) throw new Error("Failed to send email");

    return c.json({ success: true });
  } catch (error: any) {
    return c.error(error.message);
  }
}

export async function PUT(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { token, password } = await c.req.json();
    if (!token || !password) throw new Error("Invalid request");

    const data = await redis.get(`password-reset:${token}`);
    if (!data) throw new Error("Invalid token");

    const { email, user } = JSON.parse(data);
    const userData = await UserModel.findById(user);
    if (!userData) throw new Error("User not found");

    const hashedPassword = await Bun.password.hashSync(password);

    await userData.updateOne({ password: hashedPassword });
    await redis.del(`password-reset:${token}`);

    return c.json({ success: true });
  } catch (error: any) {
    return c.error(error.message);
  }
}
