import { Hono } from "hono";
import { signup } from "./signup";
import { login } from "./login";

// Create a router for authentication endpoints
export const authRouter = new Hono<{ Bindings: Env }>();

// Register signup endpoint
authRouter.post("/signup", signup);

// Register login endpoint
authRouter.post("/login", login);
