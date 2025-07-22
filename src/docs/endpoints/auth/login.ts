import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.number(),
      username: z.string(),
      email: z.string(),
    }),
  }),
});

const LoginErrorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  details: z.array(z.any()).optional(),
});

export class LoginOpenAPI extends OpenAPIRoute {
  schema: any = {
    tags: ["Authentication"],
    summary: "Login with username and password",
    description:
      "Authenticate a user and receive a JWT token for accessing protected endpoints",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              username: {
                type: "string",
                description: "Username for the account",
                example: "testuser",
              },
              password: {
                type: "string",
                description: "Password for the account",
                example: "password123",
              },
            },
            required: ["username", "password"],
          },
          examples: {
            "valid-login": {
              summary: "Valid login request",
              value: {
                username: "testuser",
                password: "password123",
              },
            },
            "another-user": {
              summary: "Another user login",
              value: {
                username: "johndoe",
                password: "mySecurePassword",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description:
          "Login successful - Returns JWT token and user information",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },
                message: {
                  type: "string",
                  example: "Login successful",
                },
                data: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "JWT token for authentication",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODk2NzIwMDAsImV4cCI6MTY4OTY3NTYwMH0.signature",
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                          example: 1,
                        },
                        username: {
                          type: "string",
                          example: "testuser",
                        },
                        email: {
                          type: "string",
                          example: "test@example.com",
                        },
                      },
                    },
                  },
                },
              },
            },
            examples: {
              "successful-login": {
                summary: "Successful login response",
                value: {
                  success: true,
                  message: "Login successful",
                  data: {
                    token:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODk2NzIwMDAsImV4cCI6MTY4OTY3NTYwMH0.signature",
                    user: {
                      id: 1,
                      username: "testuser",
                      email: "test@example.com",
                    },
                  },
                },
              },
            },
          },
        },
      },
      "400": {
        description: "Invalid request body - Missing or invalid fields",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                error: {
                  type: "string",
                  example: "Invalid request body",
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                  },
                  example: [
                    {
                      code: "invalid_type",
                      expected: "string",
                      received: "undefined",
                      path: ["username"],
                      message: "Required",
                    },
                  ],
                },
              },
            },
            examples: {
              "missing-username": {
                summary: "Missing username",
                value: {
                  success: false,
                  error: "Invalid request body",
                  details: [
                    {
                      code: "invalid_type",
                      expected: "string",
                      received: "undefined",
                      path: ["username"],
                      message: "Required",
                    },
                  ],
                },
              },
              "missing-password": {
                summary: "Missing password",
                value: {
                  success: false,
                  error: "Invalid request body",
                  details: [
                    {
                      code: "invalid_type",
                      expected: "string",
                      received: "undefined",
                      path: ["password"],
                      message: "Required",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      "401": {
        description: "Authentication failed - Invalid credentials",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                error: {
                  type: "string",
                  example: "Invalid username or password",
                },
              },
            },
            examples: {
              "invalid-credentials": {
                summary: "Invalid username or password",
                value: {
                  success: false,
                  error: "Invalid username or password",
                },
              },
            },
          },
        },
      },
      "500": {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                error: {
                  type: "string",
                  example: "Internal server error",
                },
              },
            },
            examples: {
              "server-error": {
                summary: "Server error",
                value: {
                  success: false,
                  error: "Internal server error",
                },
              },
            },
          },
        },
      },
    },
  };
}
