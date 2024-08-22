import { type LoaderFunctionArgs } from '@remix-run/node'
import { getSession } from '~/lib/auth'
import { API_URL } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch(API_URL + '/logout', {
    headers: {
      cookie: getSession(request),
    },
  })
  throw new Response(null, {
    status: 302,
    headers: {
      Location: '/login',
      'Set-Cookie': response.headers.get('Set-Cookie') || '',
    },
  })
}
