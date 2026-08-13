import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AdminSession } from "./types";

export const SESSION_COOKIE = "sab_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 hari

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET belum diatur. Salin .env.example menjadi .env dan isi JWT_SECRET."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      id: payload.id as number,
      username: payload.username as string,
      nama: payload.nama as string,
    };
  } catch {
    return null;
  }
}

/** Dipakai di Server Components / Route Handlers (bukan middleware) */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
