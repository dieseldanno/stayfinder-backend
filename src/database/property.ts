import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewProperty } from "../types/property.js";
import type { PropertyQuery } from "../validators/propertyQueryValidator.js";

export async function getProperties(
  supabase: SupabaseClient,
  filters: PropertyQuery = { order: "asc" },
) {
  let query = supabase.from("properties").select("*");

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }
  if (filters.maxPrice) {
    query = query.lte("price_per_night", filters.maxPrice);
  }
  if (filters.guests) {
    query = query.gte("max_guests", filters.guests);
  }
  if (filters.sort === "price") {
    query = query.order("price_per_night", {
      ascending: filters.order === "asc",
    });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPropertyById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProperty(
  supabase: SupabaseClient,
  property: NewProperty,
) {
  const { data, error } = await supabase
    .from("properties")
    .insert(property)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProperty(
  supabase: SupabaseClient,
  id: string,
  property: Partial<NewProperty>,
) {
  const { data, error } = await supabase
    .from("properties")
    .update(property)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProperty(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
