import type { ActionFunctionArgs } from '@remix-run/node'
import { API_URL } from '~/lib/utils'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  if (!email || !password) {
    return new Response('Bad Request', { status: 400 })
  }

  const loginResponse = await fetch(API_URL + '/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (!loginResponse.ok) {
    return new Response('Invalid email or password', { status: 400 })
  }

  throw new Response(null, {
    status: 302,
    headers: {
      Location: '/dashboard',
      'Set-Cookie': loginResponse.headers.get('Set-Cookie') || '',
    },
  })
}

export default function Login() {
  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center py-12 px-8'>
        <div className='mt-10 mx-auto w-full max-w-[480px]'>
          <div className='bg-white p-12 shadow rounded-lg'>
            <div className='mx-auto w-full max-w-md'>
              <img
                alt='Comms Search'
                src='https://tailwindui.com/img/logos/mark.svg?color=pink&shade=600'
                className='mx-auto h-10 w-auto'
              />
              <h2 className='mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                Sign in to your account
              </h2>
            </div>
            <form action='#' method='POST' className='mt-8 space-y-6'>
              <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 text-sm leading-6'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Password
                </label>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 text-sm leading-6'
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
