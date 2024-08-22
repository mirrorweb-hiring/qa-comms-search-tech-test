import { hash, verify } from '@node-rs/argon2'
import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
}

export async function verifyPassword(passwordHash: string, password: string) {
  return await verify(passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
}

export function createSession(db: Database, userId: number) {
  const sessionId = nanoid()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 1 week
  db.prepare(
    'INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(sessionId, userId, Math.floor(expiresAt.getTime() / 1000))
  return {
    id: sessionId,
    userId,
    expiresAt,
  }
}

export function validateSession(db: Database, sessionId: string) {
  const session = getSession(db, sessionId)
  if (!session) {
    return { session: null, user: null }
  }
  const user = getUserFromSession(db, sessionId)
  if (!user) {
    deleteSession(db, sessionId)
    return { session: null, user: null }
  }

  if (isSessionExpired(session.expiresAt)) {
    deleteSession(db, sessionId)
    return { session: null, user: null }
  }

  return { session, user }
}

type SessionResult = {
  id: string
  user_id: number
  expires_at: number
}

export function getSession(db: Database, sessionId: string) {
  const result = db
    .prepare<string, SessionResult>('SELECT * FROM session WHERE id = ?')
    .get(sessionId)
  if (!result) {
    return null
  }
  return {
    id: result.id,
    userId: result.user_id,
    expiresAt: new Date(result.expires_at * 1000),
  }
}

export function deleteSession(db: Database, sessionId: string) {
  db.prepare('DELETE FROM session WHERE id = ?').run(sessionId)
}

type UserResult = {
  id: number
  email: string
  password_hash: string
  created_at: number
}

export function getUserFromSession(db: Database, sessionId: string) {
  const result = db
    .prepare<string, UserResult>(
      `SELECT
          user.*
        FROM
          session
        INNER JOIN
          user ON user.id = session.user_id WHERE session.id = ?
        `
    )
    .get(sessionId)
  if (!result) {
    return null
  }
  return {
    id: result.id,
    email: result.email,
    passwordHash: result.password_hash,
    created_at: new Date(result.created_at * 1000),
  }
}

export function getUserByEmail(db: Database, email: string) {
  const result = db
    .prepare<string, UserResult>('SELECT * FROM user WHERE email = ?')
    .get(email)
  if (!result) {
    return null
  }
  return {
    id: result.id,
    email: result.email,
    passwordHash: result.password_hash,
    createdAt: new Date(result.created_at * 1000),
  }
}

export function isSessionExpired(expiresAt: Date) {
  return expiresAt.getTime() < Date.now()
}
