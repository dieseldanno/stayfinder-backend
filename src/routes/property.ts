import { Hono } from "hono";
import { promises as fs } from "fs";

const propertyApp = new Hono();

const DATA_PATH = "src/data/properties.json";

let properties: Property[] = [];
let loaded = false;

async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  try {
    const data = await fs.readFile(DATA_PATH, "utf8");
    properties = JSON.parse(data);
  } catch {
    properties = [];
  }
  loaded = true;
}

// GET /properties
propertyApp.get("/", async (c) => {
  await ensureLoaded();
  return c.json(properties);
});

// GET /properties/:id
propertyApp.get("/:id", async (c) => {
  await ensureLoaded();
  const id = c.req.param("id");
  const property = properties.find((p) => p.property_id === id);

  if (!property) {
    return c.json({ error: "Property not found" }, 404);
  }

  return c.json(property);
});

// POST /properties
propertyApp.post("/", async (c) => {
  await ensureLoaded();

  const body = await c.req.json<Omit<Property, "property_id">>();

  const newProperty: Property = {
    property_id: `property_${Math.floor(1000 + Math.random() * 9000)}`,
    ...body
  };

  properties.push(newProperty);

  return c.json(newProperty, 201);
});

// DELETE /properties/:id (bonus)
propertyApp.delete("/:id", async (c) => {
  await ensureLoaded();
  const id = c.req.param("id");
  const index = properties.findIndex((p) => p.property_id === id);

  if (index === -1) {
    return c.json({ error: "Property not found" }, 404);
  }

  const [removed] = properties.splice(index, 1);
  return c.json(removed);
});

// PUT /properties/:id (bonus 2)
propertyApp.put("/:id", async (c) => {
  await ensureLoaded();
  const id = c.req.param("id");
  const index = properties.findIndex((p) => p.property_id === id);

  if (index === -1) {
    return c.json({ error: "Property not found" }, 404);
  }

  const body = await c.req.json<Partial<Property>>();

  const updatedProperty: Property = {
    ...properties[index],
    ...body,
    property_id: id // id:t från URL:en styr alltid, oavsett vad body innehåller
  };

  properties[index] = updatedProperty;

  return c.json(updatedProperty);
});

export default propertyApp;
