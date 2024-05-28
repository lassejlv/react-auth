import { UserModel } from "@/schemas/user";
import { env } from "@/utils/env";
import redis from "@/utils/redis";
import { resend } from "@/utils/sendMail";
import { Context } from "probun";

export async function POST(req: Request): Promise<Response> {
  const c = Context(req);

  try {
    const { email, token } = await c.req.json();
    if (!email || !token) throw new Error("Invalid request");

    // Check if the user exists
    const tokenExists = await redis.get(`session:${token}`);
    if (!tokenExists) throw new Error("Invalid token");

    const { user } = JSON.parse(tokenExists);

    const userData = await UserModel.findById(user);
    if (!userData) throw new Error("User not found");
    if (userData.email_verified) throw new Error("Email already verified");

    const alreadyInUse = await UserModel.findOne({ email });
    if (alreadyInUse) throw new Error("Email already in use");

    // Send the verification email
    const verificationToken = crypto.randomUUID();
    await redis.set(`email:${verificationToken}`, JSON.stringify({ email, user }), "EX", 60 * 60 * 24);

    // Send the email here
    const { error } = await resend.emails.send({
      from: "react-auth@mails.lassejlv.dk",
      to: email,
      subject: "Verify your email",
      text: `Click here to verify your email: ${env.HOST}/auth/verify-email/${verificationToken}`,
    });

    if (error) throw new Error("Failed to send verification email");

    return c.json({ message: "Verification email sent successfully" });
  } catch (error: any) {
    return c.error(error.message);
  }
}
