import { Hono } from "hono";
import authValidator from "../validators/authValidator.js";
import { requireAuth } from "../middleware/auth.js";

export const authApp = new Hono();

authApp.post("/register", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json({ user: data.user }, 201);
});

authApp.post("/login", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: "Invalid credentials" }, 400);
  }
  return c.json({ user: data.user }, 200);
});

authApp.get("/me", requireAuth, async (c) => {
  const user = c.get("user");
  return c.json({ user });
});

authApp.post("/logout", requireAuth, async (c) => {
  const supabase = c.get("supabase");
  const { error } = await supabase.auth.signOut();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json({ message: "Logged out" });
});
