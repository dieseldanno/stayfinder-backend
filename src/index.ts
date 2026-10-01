import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "./env.js";
import propertyApp from "./routes/property.js";

const app = new Hono({
  strict: false,
});

app.get("/", (c) => {
  return c.text("StayFinder API");
});
app.route("/properties", propertyApp);

serve(
  {
    fetch: app.fetch,
    port: env.honoPort,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
