import { MiddlewareHandler } from "hono";
import { ApiException } from "chanfana";
import { verifyJWT } from "../utils/auth";

type Variables = {
  user: any;
};

export const jwtAuth = (): MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiException("Unauthorized: Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = c.env.JWT_SECRET || "default_secret";

    const payload = await verifyJWT(token, jwtSecret);

    if (!payload) {
      throw new ApiException("Unauthorized: Invalid or expired token");
    }

    c.set("user", payload);
    await next();
  };
};
