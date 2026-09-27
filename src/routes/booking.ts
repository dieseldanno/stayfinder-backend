import { Hono } from "hono";
import { promises as fs } from "fs";
import bookingValidator from "../validators/booking.js";

const bookingApp = new Hono();

const DATA_PATH = "src/data/bookings.json";

let bookings: Booking[] = [];
let loaded = false;

async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  try {
    const data = await fs.readFile(DATA_PATH, "utf8");
    bookings = JSON.parse(data);
  } catch {
    bookings = [];
  }
  loaded = true;
}

// GET /bookings
bookingApp.get("/", async (c) => {
  await ensureLoaded();
  return c.json(bookings);
});

// GET /bookings/:id
bookingApp.get("/:id", async (c) => {
  await ensureLoaded();
  const id = c.req.param("id");
  const booking = bookings.find((b) => b.booking_id === id);

  if (!booking) {
    return c.json({ error: "Booking not found" }, 404);
  }

  return c.json(booking);
});

// POST /bookings
bookingApp.post("/", bookingValidator, async (c) => {
  await ensureLoaded();

  try {
    const booking: NewBooking = c.req.valid("json");

    const newBooking: Booking = {
      ...booking,
      booking_id: booking.booking_id as string,
      status: booking.status as "pending" | "confirmed" | "cancelled"
    };

    bookings.push(newBooking);

    return c.json(newBooking, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create booking" }, 400);
  }
});

// PUT /bookings/:id
bookingApp.put("/:id", bookingValidator, async (c) => {
  await ensureLoaded();
  const id = c.req.param("id");
  const index = bookings.findIndex((b) => b.booking_id === id);

  if (index === -1) {
    return c.json({ error: "Booking not found" }, 404);
  }

  const body = c.req.valid("json");

  const updatedBooking: Booking = {
    ...bookings[index],
    ...body,
    booking_id: id // id:t från URL:en styr alltid vilken bokning som uppdateras
  };

  bookings[index] = updatedBooking;

  return c.json(updatedBooking);
});

// DELETE /bookings/:id
bookingApp.delete("/:id", async (c) => {
  await ensureLoaded();
  const id = c.req.param("id");
  const index = bookings.findIndex((b) => b.booking_id === id);

  if (index === -1) {
    return c.json({ error: "Booking not found" }, 404);
  }

  const [removed] = bookings.splice(index, 1);
  return c.json(removed);
});

export default bookingApp;
