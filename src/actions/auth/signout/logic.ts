import { clearSessionCookie, SessionData } from '@/lib/session';

export async function signOut(session: SessionData | null) {
  await clearSessionCookie();
}