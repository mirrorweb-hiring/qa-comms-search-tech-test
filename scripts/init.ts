import { faker } from '@faker-js/faker'
import Database from 'better-sqlite3'
import { nanoid } from 'nanoid'
import fs from 'node:fs'
import { hashPassword } from '../api/auth'

// Remove old database directory if it exists
if (fs.existsSync('db')) {
  fs.rmSync('db', { recursive: true })
}

// Create new database
fs.mkdirSync('db')
const db = new Database('db/comms.db')

// Initialize database schema
db.exec(fs.readFileSync('scripts/schema.sql', 'utf-8'))

// User
const insertAgent = db.prepare(
  'INSERT INTO user (id, email, password_hash) VALUES (?, ?, ?)'
)
const id = nanoid()
const email = 'example@example.com'
const password = 'asdf'
const hashedPassword = await hashPassword(password)
insertAgent.run(id, email, hashedPassword)

// Identities
const insertIdentity = db.prepare(
  'INSERT INTO identity (id, email) VALUES (?, ?)'
)
const identities = []
for (let i = 1; i < 101; i++) {
  const id = nanoid()
  const email = faker.internet.email().toLowerCase()
  identities.push({ id, email })
  insertIdentity.run(id, email)
}

// Messages
const insertMessage = db.prepare(
  'INSERT INTO message (id, `subject`, `content`, `from`, `to`, created_at, `status`) VALUES (?, ?, ?, ?, ?, ?, ?)'
)

const validStatusList = ['compliant', 'non_compliant', null]

for (let i = 0; i < 100; i++) {
  const id = nanoid()
  const subject = faker.lorem.sentence()
  const body = faker.lorem.paragraph()
  const from = identities[Math.floor(Math.random() * identities.length)]
  const to = identities[Math.floor(Math.random() * identities.length)]
  const createdAt = faker.date.between({ from: '2024-05-01', to: '2024-06-31' })
  const randomStatus =
    validStatusList[Math.floor(Math.random() * validStatusList.length)]
  insertMessage.run(
    id,
    subject,
    body,
    from.id,
    to.id,
    Math.floor(createdAt.getTime() / 1000),
    randomStatus
  )
}

// Close database
db.close()

console.log(`
  Your login credentials are:

  Email: ${email}
  Password: ${password}
`)
