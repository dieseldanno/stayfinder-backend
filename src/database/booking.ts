import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewBooking, Booking } from "../types/booking.js";
import { BookingQuery } from "../validators/bookingQueryValidator.js";

export async function getBookings(
  supabase: SupabaseClient,
  filters: BookingQuery = {},
): Promise<Booking[]> {
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.property_id) {
    query = query.eq("property_id", filters.property_id);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBookingById(
  supabase: SupabaseClient,
  id: string,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createBooking(
  supabase: SupabaseClient,
  booking: NewBooking,
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...booking, status: booking.status ?? "pending" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Booking could not be created");
  return data;
}

export async function updateBooking(
  supabase: SupabaseClient,
  id: string,
  booking: NewBooking,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .update(booking)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteBooking(
  supabase: SupabaseClient,
  id: string,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
