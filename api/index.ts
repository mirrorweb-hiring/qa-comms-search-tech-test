import { serve } from '@hono/node-server'
import Database from 'better-sqlite3'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { timeout } from 'hono/timeout'
import {
  createSession,
  deleteSession,
  getUserByEmail,
  validateSession,
  verifyPassword,
} from './auth'
import { wait } from './utils'

const db = new Database('db/comms.db')

const PORT = 8080
const app = new Hono()
serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  () => {
    console.log(`Server is running at http://localhost:${PORT}`)
  }
)

// Allow requests from the client-side of Remix app
app.use(
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
  })
)

// Set a timeout of 5 seconds for all requests
app.use(timeout(3000))

app.get('/me', async (c) => {
  // Check if the user is authenticated
  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.text('', 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.text('', 401)

  return c.json(user)
})

app.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) {
    return c.json({ error: 'Bad Request' }, 400)
  }

  const user = getUserByEmail(db, email as string)
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 400)
  }

  const isValidPassword = await verifyPassword(
    user.passwordHash,
    password as string
  )
  if (!isValidPassword) {
    return c.json({ error: 'Invalid email or password' }, 400)
  }

  const session = createSession(db, user.id)
  setCookie(c, 'comms_auth', session.id)
  return c.json({ user }, 200)
})

app.get('/logout', async (c) => {
  const sessionCookie = getCookie(c, 'comms_auth')
  if (!sessionCookie) {
    return c.json({ message: 'Bad request' }, 400)
  }
  deleteSession(db, sessionCookie)
  setCookie(c, 'comms_auth', '', { maxAge: 0 })
  return c.json({ message: 'Logged out' })
})

app.get('/messages', async (c) => {
  // Check if the user is authenticated
  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.json({ error: 'Unauthenticated' }, 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.json({ error: 'Unauthenticated' }, 401)

  const order = c.req.param('order') || 'asc'
  const messages = db
    .prepare(
      `SELECT
          m.id,
          m.subject,
          m.content,
          m.status,
          m.created_at,
          from_identity.email as from_email,
          to_identity.email as to_email
        FROM
          message m
        JOIN
          identity from_identity ON m.\`from\` = from_identity.id
        JOIN
          identity to_identity ON m.\`to\` = to_identity.id
        ORDER BY m.created_at ${order.toUpperCase()}
        LIMIT 10
      `
    )
    .all()
  return c.json(messages)
})

app.get('/messages/:id', async (c) => {
  // Check if the user is authenticated
  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.json({ error: 'Unauthenticated' }, 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.json({ error: 'Unauthenticated' }, 401)

  const messageId = c.req.param('id')
  if (!messageId) {
    return c.json({ error: 'Please provide a message ID' }, 400)
  }

  const message = db
    .prepare(
      `SELECT
          m.id,
          m.subject,
          m.content,
          m.status,
          m.created_at,
          from_identity.email as from_email,
          to_identity.email as to_email
        FROM
          message m
        JOIN
          identity from_identity ON m.\`from\` = from_identity.id
        JOIN
          identity to_identity ON m.\`to\` = to_identity.id
        WHERE
          m.id = ?
      `
    )
    .get(messageId)

  if (!message) {
    return c.json({ error: 'Message not found' }, 404)
  }

  return c.json(message)
})

app.put('/messages/:id', async (c) => {
  // Check if the user is authenticated
  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.json({ error: 'Unauthenticated' }, 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.json({ error: 'Unauthenticated' }, 401)

  const messageId = c.req.param('id')
  if (!messageId) {
    return c.json({ error: 'Please provide a message ID' }, 400)
  }

  const { status } = await c.req.json()
  if (!status) {
    return c.json({ error: 'Please provide a status' }, 400)
  }

  if (status !== 'compliant' && status !== 'non_compliant') {
    return c.json({ error: 'Please provide a valid status' }, 400)
  }

  db.prepare('UPDATE message SET status = ? WHERE id = ?').run(
    status,
    messageId
  )

  return c.json({ message: 'Message updated' })
})

app.get('/search', (c) => {
  // Check if the user is authenticated
  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.json({ error: 'Unauthenticated' }, 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.json({ error: 'Unauthenticated' }, 401)

  const query = c.req.query('q')
  if (!query) {
    return c.json({ error: 'Please provide a search query' }, 400)
  }

  const messages = db
    .prepare(
      `SELECT
          m.id,
          m.subject,
          m.content,
          m.status,
          m.created_at,
          from_identity.email as from_email,
          to_identity.email as to_email
        FROM
          message m
        JOIN
          identity from_identity ON m.\`from\` = from_identity.id
        JOIN
          identity to_identity ON m.\`to\` = to_identity.id
        WHERE
          m.subject LIKE ? OR m.content LIKE ?
        ORDER BY m.created_at DESC
      `
    )
    .all(`%${query}%`, `%${query}%`)

  return c.json(messages)
})

app.get('/stats/total-messages', async (c) => {
  await wait(Math.random() * 4000)

  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.json({ error: 'Unauthenticated' }, 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.json({ error: 'Unauthenticated' }, 401)

  // Count all messages ingested in June 2024
  const currentMonth = db
    .prepare(
      'SELECT COUNT(*) as total FROM message WHERE created_at >= ? AND created_at < ?'
    )
    .get(
      new Date('2024-06-01').getTime() / 1000,
      new Date('2024-07-01').getTime() / 1000
    ) as { total: number }

  // Count all messages ingested in May 2024
  const previousMonth = db
    .prepare(
      'SELECT COUNT(*) as total FROM message WHERE created_at >= ? AND created_at < ?'
    )
    .get(
      new Date('2024-05-01').getTime() / 1000,
      new Date('2024-06-01').getTime() / 1000
    ) as { total: number }

  return c.json({
    currentMonth: currentMonth.total,
    previousMonth: previousMonth.total,
  })
})

app.get('/stats/total-message-actions', async (c) => {
  const sessionId = getCookie(c, 'comms_auth')
  if (!sessionId) return c.json({ error: 'Unauthenticated' }, 401)
  const { session, user } = validateSession(db, sessionId)
  if (!session || !user) return c.json({ error: 'Unauthenticated' }, 401)

  // Count all messages actioned in June 2024
  const currentMonth = db
    .prepare(
      `SELECT
          COUNT(*) as total
        FROM
          message
        WHERE
          created_at >= ? AND created_at < ?
        AND
          status IS NOT NULL`
    )
    .get(
      new Date('2024-06-01').getTime() / 1000,
      new Date('2024-07-01').getTime() / 1000
    ) as { total: number }

  // Count all messages actioned in May 2024
  const previousMonth = db
    .prepare(
      `SELECT
          COUNT(*) as total
        FROM
          message
        WHERE
          created_at >= ? AND created_at < ?
        AND
          status IS NOT NULL`
    )
    .get(
      new Date('2024-05-01').getTime() / 1000,
      new Date('2024-06-01').getTime() / 1000
    ) as { total: number }

  return c.json({
    currentMonth: currentMonth.total,
    previousMonth: previousMonth.total,
  })
})
