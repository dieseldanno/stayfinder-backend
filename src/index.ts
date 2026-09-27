import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import propertyApp from "./routes/property.js";
import bookingApp from "./routes/booking.js";

dotenv.config();

const app = new Hono({
  strict: false
});

app.get("/", (c) => {
  return c.text("StayFinder API");
});

app.route("/properties", propertyApp);
app.route("/bookings", bookingApp);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
