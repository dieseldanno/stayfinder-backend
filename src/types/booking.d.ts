export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface NewBooking {
  property_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  status?: BookingStatus;
}

export interface Booking extends NewBooking {
  id: string;
  created_at: string;
  status: BookingStatus;
}
