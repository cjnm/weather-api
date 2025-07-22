import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

const SignupRequestSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const SignupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    username: z.string(),
    email: z.string(),
  }),
});

export class SignupOpenAPI extends OpenAPIRoute {
  schema: any = {
    tags: ["Authentication"],
    summary: "Create a new user account",
    description:
      "Register a new user account with username, email, and password. The password will be securely hashed before storage.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              username: {
                type: "string",
                minLength: 3,
                maxLength: 50,
                description:
                  "Unique username for the account (3-50 characters)",
                example: "testuser",
              },
              email: {
                type: "string",
                format: "email",
                description: "Valid email address for the account",
                example: "test@example.com",
              },
              password: {
                type: "string",
                minLength: 8,
                maxLength: 100,
                description: "Password for the account (8-100 characters)",
                example: "password123",
              },
            },
            required: ["username", "email", "password"],
          },
          examples: {
            "new-user": {
              summary: "New user registration",
              value: {
                username: "testuser",
                email: "test@example.com",
                password: "password123",
              },
            },
            "another-user": {
              summary: "Another user example",
              value: {
                username: "johndoe",
                email: "john.doe@company.com",
                password: "mySecurePassword123",
              },
            },
            "developer-user": {
              summary: "Developer account",
              value: {
                username: "dev_sarah",
                email: "sarah@devteam.io",
                password: "DevPassword2024!",
              },
            },
          },
        },
      },
    },
    responses: {
      "201": {
        description: "User created successfully - Account has been registered",
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
                  example: "User created successfully",
                },
                data: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser",
                    },
                    email: {
                      type: "string",
                      example: "test@example.com",
                    },
                  },
                  description:
                    "Created user information (password is not returned for security)",
                },
              },
            },
            examples: {
              "successful-signup": {
                summary: "Successful user creation",
                value: {
                  success: true,
                  message: "User created successfully",
                  data: {
                    username: "testuser",
                    email: "test@example.com",
                  },
                },
              },
              "another-success": {
                summary: "Another successful signup",
                value: {
                  success: true,
                  message: "User created successfully",
                  data: {
                    username: "johndoe",
                    email: "john.doe@company.com",
                  },
                },
              },
            },
          },
        },
      },
      "400": {
        description:
          "Invalid request body - Validation errors in the provided data",
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
                  description: "Detailed validation errors",
                },
              },
            },
            examples: {
              "short-username": {
                summary: "Username too short",
                value: {
                  success: false,
                  error: "Invalid request body",
                  details: [
                    {
                      code: "too_small",
                      minimum: 3,
                      type: "string",
                      inclusive: true,
                      exact: false,
                      message: "String must contain at least 3 character(s)",
                      path: ["username"],
                    },
                  ],
                },
              },
              "invalid-email": {
                summary: "Invalid email format",
                value: {
                  success: false,
                  error: "Invalid request body",
                  details: [
                    {
                      validation: "email",
                      code: "invalid_string",
                      message: "Invalid email",
                      path: ["email"],
                    },
                  ],
                },
              },
              "short-password": {
                summary: "Password too short",
                value: {
                  success: false,
                  error: "Invalid request body",
                  details: [
                    {
                      code: "too_small",
                      minimum: 8,
                      type: "string",
                      inclusive: true,
                      exact: false,
                      message: "String must contain at least 8 character(s)",
                      path: ["password"],
                    },
                  ],
                },
              },
              "missing-fields": {
                summary: "Missing required fields",
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
                    {
                      code: "invalid_type",
                      expected: "string",
                      received: "undefined",
                      path: ["email"],
                      message: "Required",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      "409": {
        description: "Conflict - Username or email already exists",
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
                  example: "Username or email already exists",
                },
              },
            },
            examples: {
              "duplicate-user": {
                summary: "Username or email already taken",
                value: {
                  success: false,
                  error: "Username or email already exists",
                },
              },
            },
          },
        },
      },
      "500": {
        description:
          "Internal server error - Something went wrong on the server",
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
                summary: "Database or server error",
                value: {
                  success: false,
                  error: "Internal server error",
                },
              },
              "database-error": {
                summary: "Failed to create user",
                value: {
                  success: false,
                  error: "Failed to create user",
                },
              },
            },
          },
        },
      },
    },
  };
}
