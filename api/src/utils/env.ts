import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string().min(1),
    HOST: z.string().url(),
    FRONTEND_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    MONGO_URL: z.string().url(),
    RESEND_API_KEY: z.string(),
  },
  runtimeEnv: Bun.env,
});
