import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewBooking, Booking } from "../types/booking.js";

export async function getBookings(
  supabase: SupabaseClient,
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

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
