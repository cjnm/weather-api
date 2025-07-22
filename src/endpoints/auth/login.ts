import { Handler } from "hono";
import { ApiException } from "chanfana";
import { z } from "zod";
import { verifyPassword } from "../../utils/auth";

// Define the schema for login request
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * Login endpoint
 * Authenticates a user and returns a JWT token
 */
export const login: Handler<{ Bindings: Env }> = async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      throw new ApiException({
        code: 400,
        message: "Invalid request body",
        details: result.error.errors,
      });
    }

    const { username, password } = result.data;

    // Find the user by username
    const user = await c.env.DB.prepare(
      "SELECT id, username, email, password_hash FROM users WHERE username = ?"
    )
      .bind(username)
      .first();

    if (!user) {
      throw new ApiException({
        code: 401,
        message: "Invalid username or password",
      });
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new ApiException({
        code: 401,
        message: "Invalid username or password",
      });
    }

    // Generate a JWT token
    const jwtSecret = c.env.JWT_SECRET || "default_secret";

    // Create the JWT header
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    // Create the JWT payload with expiration (1 hour)
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      iat: now,
      exp,
    };

    // Encode the header and payload
    const encodedHeader = btoa(JSON.stringify(header))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // Create the signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);

    const keyData = encoder.encode(jwtSecret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      { name: "HMAC", hash: "SHA-256" },
      key,
      data
    );

    // Convert the signature to base64url
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // Create the JWT token
    const token = `${encodedHeader}.${encodedPayload}.${signatureBase64}`;

    // Return the token
    return c.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    console.error("Error in login:", error);
    throw new ApiException({
      code: 500,
      message: "Internal server error",
    });
  }
};
