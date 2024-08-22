import cookie from 'cookie'
import { API_URL } from './utils'

export async function requireSession(request: Request) {
  const sessionCookie = getSession(request)
  if (!sessionCookie) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: '/login',
      },
    })
  }

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      cookie: sessionCookie,
    },
  })
  if (!response.ok) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: '/login',
      },
    })
  }

  return {
    session: sessionCookie,
    user: await response.json(),
  }
}

export function getSession(request: Request) {
  const cookieString = request.headers.get('cookie') || ''
  const cookieValue = cookie.parse(cookieString)['comms_auth']
  return cookieValue ? `comms_auth=${cookieValue}` : ''
}
