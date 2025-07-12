import { clearSessionCookie } from '@/lib/session';

export async function signOut() {
  await clearSessionCookie();
}
