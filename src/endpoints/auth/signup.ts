import { Handler } from "hono";
import { ApiException } from "chanfana";
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
      throw new ApiException({
        code: 400,
        message: "Invalid request body",
        details: result.error.errors,
      });
    }

    const { username, email, password } = result.data;

    // Check if username or email already exists
    const existingUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE username = ? OR email = ?"
    )
      .bind(username, email)
      .first();

    if (existingUser) {
      throw new ApiException({
        code: 409,
        message: "Username or email already exists",
      });
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
      throw new ApiException({
        code: 500,
        message: "Failed to create user",
      });
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
    if (error instanceof ApiException) {
      throw error;
    }

    console.error("Error in signup:", error);
    throw new ApiException({
      code: 500,
      message: "Internal server error",
    });
  }
};
