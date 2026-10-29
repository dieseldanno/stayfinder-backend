import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const propertyQuerySchema = z.object({
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  maxPrice: z.coerce
    .number()
    .int()
    .positive("Max price must be greater than 0")
    .optional(),
  guests: z.coerce
    .number()
    .int()
    .min(1, "Guests needs to be at least 1")
    .max(35, "Guests cannot be more than 35")
    .optional(),
  sort: z.enum(["price"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

const propertyQueryValidator = zValidator(
  "query",
  propertyQuerySchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.issues }, 400);
    }
  },
);

export default propertyQueryValidator;
export type PropertyQuery = z.infer<typeof propertyQuerySchema>;

// Tre punkter du kan få på den muntliga:
// varför coerce behövs (query-parametrar är alltid strängar),
// varför order har .default() men inte .optional() (fältet finns alltid efter valideringen),
// och varför "query" och inte "param".
