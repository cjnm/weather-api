import { Handler } from "hono";
import { z } from "zod";
import { hashPassword } from "../../utils/auth";

// Define the schema for signup request
const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

/**
 * Signup endpoint
 * Creates a new user account
 */
export const signup: Handler<{ Bindings: Env }> = async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: "Invalid request body",
          details: result.error.errors,
        },
        400
      );
    }

    const { username, email, password } = result.data;

    // Check if username or email already exists
    const existingUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE username = ? OR email = ?"
    )
      .bind(username, email)
      .first();

    if (existingUser) {
      return c.json(
        { success: false, error: "Username or email already exists" },
        409
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Insert the new user
    const result2 = await c.env.DB.prepare(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
    )
      .bind(username, email, passwordHash)
      .run();

    if (!result2.success) {
      return c.json({ success: false, error: "Failed to create user" }, 500);
    }

    // Return success response
    return c.json(
      {
        success: true,
        message: "User created successfully",
        data: {
          username,
          email,
        },
      },
      201
    );
  } catch (error) {
    console.error("Error in signup:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
};
