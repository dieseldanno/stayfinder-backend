import { Hono } from "hono";
import * as db from "../database/property.js";
import propertyValidator from "../validators/property.js";
import propertyParamValidator from "../validators/propertyParamValidator.js";
import { requireAuth } from "../middleware/auth.js";
import type { NewProperty } from "../types/property.js";
import propertyQueryValidator from "../validators/propertyQueryValidator.js";

const propertyApp = new Hono();

propertyApp.get("/", propertyQueryValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const filters = c.req.valid("query");
    const properties = await db.getProperties(supabase, filters);
    return c.json(properties);
  } catch (error) {
    return c.json({ error: "Failed to fetch properties" }, 500);
  }
});

propertyApp.get("/:id", propertyParamValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.valid("param");
    const property = await db.getPropertyById(supabase, id);

    if (!property) {
      return c.json({ error: "Property not found" }, 404);
    }
    return c.json(property);
  } catch (error) {
    return c.json({ error: "Failed to fetch property" }, 500);
  }
});

propertyApp.post("/", requireAuth, propertyValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const newProperty: NewProperty = c.req.valid("json");
    const property = await db.createProperty(supabase, newProperty);
    return c.json(property, 201);
  } catch (error) {
    return c.json({ error: "Failed to create property" }, 400);
  }
});

propertyApp.put(
  "/:id",
  requireAuth,
  propertyParamValidator,
  propertyValidator,
  async (c) => {
    try {
      const supabase = c.get("supabase");
      const { id } = c.req.valid("param");
      const body: NewProperty = c.req.valid("json");
      const updatedProperty = await db.updateProperty(supabase, id, body);

      if (!updatedProperty) {
        return c.json({ error: "Property not found" }, 404);
      }
      return c.json(updatedProperty);
    } catch (error) {
      return c.json({ error: "Failed to update property" }, 400);
    }
  },
);

propertyApp.delete("/:id", requireAuth, propertyParamValidator, async (c) => {
  try {
    const supabase = c.get("supabase");
    const { id } = c.req.valid("param");
    const deletedProperty = await db.deleteProperty(supabase, id);

    if (!deletedProperty) {
      return c.json({ error: "Property not found" }, 404);
    }
    return c.json({ message: "Property deleted", property: deletedProperty });
  } catch (error) {
    return c.json({ error: "Failed to delete property" }, 500);
  }
});

export default propertyApp;
