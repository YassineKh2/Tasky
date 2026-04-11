import { cookies } from "next/headers";
import { decrypt } from "./session";

/**
 * Get the authenticated user's ID from the session cookie.
 * Returns null if not authenticated.
 */
export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  const session = await decrypt(sessionValue);
  return (session?.userId as string) || null;
}
