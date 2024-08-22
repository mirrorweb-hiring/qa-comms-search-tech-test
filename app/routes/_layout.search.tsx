import { type LoaderFunctionArgs } from '@remix-run/node'
import { requireSession } from '~/lib/auth'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSession(request)
  return null
}

export default function Search() {
  return (
    <div className='py-4'>
      <main>
        <div className='mx-auto max-w-4xl py-4 px-8'>
          <div className='overflow-hidden rounded-lg bg-white shadow'>
            <div className='p-8 space-y-6'>
              <div className='space-y-1'>
                <h2 className='text-xl font-semibold leading-6 text-gray-900'>
                  Search
                </h2>
                <p className='text-sm text-gray-500'>
                  Enter a search query to find messages that match your criteria
                </p>
              </div>

              <form action='/search/results' className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium leading-6 text-gray-900'>
                    Query
                  </label>
                  <div className='mt-2'>
                    <input
                      id='query'
                      name='q'
                      type='search'
                      placeholder='E.g. lorem ipsum'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 text-sm leading-6'
                    />
                  </div>
                </div>

                <div className='flex justify-end items-center'>
                  <button
                    type='submit'
                    className='flex justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
