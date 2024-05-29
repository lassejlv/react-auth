import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.get("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

// @ts-ignore
const server = Bun.serve({
  // @ts-ignore
  port: process.env.PORT || 3000,
  fetch: app.fetch,
});

console.log(`Starting server on port ${server.port}...`);
