import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const propertySchema = z.object({
  title: z.string().min(2, "Title is necessary"),
  description: z.string().min(3, "Description is necessary"),
  city: z.string().min(2, "City is necessary"),
  country: z.string().min(2, "Country is necessary"),
  price_per_night: z
    .number()
    .min(100, "Price per night needs to be minimum of 100"),
  max_guests: z.number().min(1, "Max guests needs to be at least 1"),
  image_url: z
    .string()
    .url("Image URL must be a valid URL")
    .optional()
    .nullable(),
});

const propertyValidator = zValidator("json", propertySchema, (result, c) => {
  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }
});

export default propertyValidator;
