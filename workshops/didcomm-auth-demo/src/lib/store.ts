import { SessionState } from "@/types";

// In-memory store for demo purposes
const sessions = new Map<string, SessionState>();

export function createSession(id: string, challenge: string): SessionState {
  const session: SessionState = {
    id,
    challenge,
    status: "pending",
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string): SessionState | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<SessionState>): void {
  const session = sessions.get(id);
  if (session) {
    sessions.set(id, { ...session, ...updates });
  }
}

export function clearExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(id);
    }
  }
}
