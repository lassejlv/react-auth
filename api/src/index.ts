import "./utils/redis";
import "./utils/db";
import { ProBun } from "probun"; // Import the ProBun class
import { env } from "./utils/env"; // Import the env object for type safety
import { cors } from "./middleware/cors";

const app = new ProBun({
  port: Number(env.PORT), // Port to listen on
  routes: "src/routes", // Path to routes directory
  logger: true, // Enable logging for debugging
});

app.definePreMiddleware(cors);

app.start(); // Start the server
