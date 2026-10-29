import { Hono } from "hono";
import * as db from "../database/booking.js";
import bookingValidator from "../validators/booking.js";
import bookingParamValidator from "../validators/bookingParamValidator.js";
import { requireAuth } from "../middleware/auth.js";
import type { NewBooking } from "../types/booking.js";
import bookingQueryValidator from "../validators/bookingQueryValidator.js";

const bookingApp = new Hono();

bookingApp.use("*", requireAuth);

bookingApp.get("/", bookingQueryValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const filters = c.req.valid("query");
    const bookings = await db.getBookings(supabase, filters);
    return c.json(bookings);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

bookingApp.get("/:id", bookingParamValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.valid("param");
    const booking = await db.getBookingById(supabase, id);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }
    return c.json(booking);
  } catch (error) {
    return c.json({ error: "Failed to fetch booking" }, 500);
  }
});

bookingApp.post("/", bookingValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const newBooking: NewBooking = c.req.valid("json");

    if (new Date(newBooking.check_out) <= new Date(newBooking.check_in)) {
      return c.json({ error: "Check-out must be after check-in" }, 400);
    }

    const booking = await db.createBooking(supabase, newBooking);
    return c.json(booking, 201);
  } catch (error) {
    return c.json({ error: "Failed to create booking" }, 400);
  }
});

bookingApp.put("/:id", bookingParamValidator, bookingValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.valid("param");
    const body: NewBooking = c.req.valid("json");

    if (new Date(body.check_out) <= new Date(body.check_in)) {
      return c.json({ error: "Check-out must be after check-in" }, 400);
    }

    const updatedBooking = await db.updateBooking(supabase, id, body);

    if (!updatedBooking) {
      return c.json({ error: "Booking not found" }, 404);
    }
    return c.json(updatedBooking);
  } catch (error) {
    return c.json({ error: "Failed to update booking" }, 400);
  }
});

bookingApp.delete("/:id", bookingParamValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.valid("param");
    const deletedBooking = await db.deleteBooking(supabase, id);

    if (!deletedBooking) {
      return c.json({ error: "Booking not found" }, 404);
    }
    return c.json({ message: "Booking deleted", booking: deletedBooking });
  } catch (error) {
    return c.json({ error: "Failed to delete booking" }, 500);
  }
});

export default bookingApp;
