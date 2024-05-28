import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string().min(1),
    REDIS_URL: z.string().url(),
    MONGO_URL: z.string().url(),
  },
  runtimeEnv: Bun.env,
});