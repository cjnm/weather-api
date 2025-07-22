import { MiddlewareHandler } from "hono";

type Variables = {
  user: any;
};
/**
 * JWT Authentication middleware
 * Verifies the JWT token in the Authorization header
 */

export const jwtAuth = (): MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        {
          success: false,
          error: "Unauthorized: Missing or invalid token",
        },
        401
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify the JWT token
      const jwtSecret = c.env.JWT_SECRET || "default_secret";

      // Split the token into parts
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const [encodedHeader, encodedPayload, encodedSignature] = parts;

      // Decode the payload
      const payload = JSON.parse(
        atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Check if the token has expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error("Token expired");
      }

      // Verify the signature
      const encoder = new TextEncoder();
      const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);

      const keyData = encoder.encode(jwtSecret);
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );

      // Decode the signature
      const signatureBase64 = encodedSignature
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const padding = "=".repeat((4 - (signatureBase64.length % 4)) % 4);
      const signatureRaw = atob(signatureBase64 + padding);
      const signatureArray = new Uint8Array(signatureRaw.length);
      for (let i = 0; i < signatureRaw.length; i++) {
        signatureArray[i] = signatureRaw.charCodeAt(i);
      }

      const isValid = await crypto.subtle.verify(
        { name: "HMAC", hash: "SHA-256" },
        key,
        signatureArray,
        data
      );

      if (!isValid) {
        throw new Error("Invalid signature");
      }

      // Add the user info to the context
      c.set("user", payload);

      await next();
    } catch (error) {
      console.error("JWT verification error:", error);
      return c.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        401
      );
    }
  };
};
