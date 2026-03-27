import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.HOST_JWT_SECRET || "host-jwt-secret"
);

export async function signHostToken(hostId: string) {
  return new SignJWT({ hostId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyHostToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("host-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.hostId as string;
  } catch {
    return null;
  }
}
