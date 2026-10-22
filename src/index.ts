import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { env } from "./env.js";
import { optionalAuth } from "./middleware/auth.js";
import { authApp } from "./routes/auth.js";
import propertyApp from "./routes/property.js";
import bookingApp from "./routes/booking.js";

const app = new Hono({ strict: false });

app.use(
  "*",
  cors({
    origin: env.frontendUrl,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.use("*", optionalAuth);

app.get("/", (c) => c.text("StayFinder API"));

app.route("/auth", authApp);
app.route("/properties", propertyApp);
app.route("/bookings", bookingApp);

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ error: error.message }, error.status);
  }
  return c.json({ error: "Internal server error" }, 500);
});

serve({ fetch: app.fetch, port: env.honoPort }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
