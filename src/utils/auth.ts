/**
 * Utility functions for authentication
 */

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function generateJWT(
  payload: object,
  secret: string,
  expiresIn: number = 3600
): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresIn;
  const jwtPayload = {
    ...payload,
    iat: now,
    exp,
  };

  const encoder = new TextEncoder();

  const base64UrlEncode = (input: string) =>
    btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    key,
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  );

  const signature = btoa(
    String.fromCharCode(...new Uint8Array(signatureBuffer))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function verifyJWT(
  token: string,
  secret: string
): Promise<any | null> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      return null;
    }

    const payload = JSON.parse(
      atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) {
      return null;
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);

    const signatureString = atob(
      encodedSignature.replace(/-/g, "+").replace(/_/g, "/")
    );
    const signatureArray = new Uint8Array(
      [...signatureString].map((c) => c.charCodeAt(0))
    );

    const isValid = await crypto.subtle.verify(
      { name: "HMAC", hash: "SHA-256" },
      key,
      signatureArray,
      data
    );

    return isValid ? payload : null;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}
