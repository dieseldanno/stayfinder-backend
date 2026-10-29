import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const bookingQuerySchema = z.object({
  property_id: z.string().uuid("propterty_id must be valid UUID").optional(),
});

export type BookingQuery = z.infer<typeof bookingQuerySchema>;

const bookingQueryValidator = zValidator(
  "query",
  bookingQuerySchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.issues }, 400);
    }
  },
);

export default bookingQueryValidator;
