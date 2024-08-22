import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { requireSession } from '~/lib/auth'
import { api, API_URL, classNames } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await requireSession(request)

  const [totalMessages, totalActions] = await Promise.all([
    api('/stats/total-messages', { headers: { cookie: session } }),
    api('/stats/total-message-actions', { headers: { cookie: session } }),
  ])

  return json({ totalMessages, totalActions })
}

export default function Dashboard() {
  // @ts-ignore
  const { totalMessages, totalActions } = useLoaderData()

  return (
    <div className='py-4'>
      <main>
        <div className='mx-auto max-w-6xl py-4 px-8'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-base font-semibold leading-6 text-gray-900'>
                Last 30 days
              </h3>
              <dl className='mt-4 grid grid-cols-2 divide-x overflow-hidden rounded-lg bg-white shadow'>
                <StatsTotalCard
                  name='Total Messages'
                  currentMonth={totalMessages.currentMonth}
                  previousMonth={totalMessages.previousMonth}
                />
                <StatsTotalCard
                  name='Total Actions'
                  currentMonth={totalActions.currentMonth}
                  previousMonth={totalActions.previousMonth}
                />
              </dl>
            </div>

            <div>
              <h3 className='text-base font-semibold leading-6 text-gray-900'>
                Most recent messages
              </h3>
              <MessageList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatsTotalCard({ name, currentMonth, previousMonth }: any) {
  const change = ((currentMonth - previousMonth) / previousMonth) * 100
  const changeType = change > 0 ? 'increase' : 'decrease'

  return (
    <div className='px-4 py-5 sm:p-6'>
      <dt className='text-base font-normal text-gray-900'>{name}</dt>
      <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
        <div className='flex items-baseline text-2xl font-semibold text-pink-600'>
          {currentMonth}
          <span className='ml-2 text-sm font-medium text-gray-500'>
            {changeType === 'increase' ? 'up' : 'down'} from {previousMonth}
          </span>
        </div>

        <div
          className={classNames(
            changeType === 'increase'
              ? 'bg-green-100 text-green-400'
              : 'bg-red-100 text-red-400',
            'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
          )}
        >
          {changeType === 'increase' ? (
            <ArrowUpIcon className='-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-400' />
          ) : (
            <ArrowDownIcon className='-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-400' />
          )}

          <span className='sr-only'>
            {' '}
            {changeType === 'increase' ? 'Increased' : 'Decreased'} by{' '}
          </span>
          <span>{change + '%'}</span>
        </div>
      </dd>
    </div>
  )
}

function MessageList() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch(API_URL + '/messages', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data)
      })
  })

  return (
    <ul
      role='list'
      className='mt-4 divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl'
    >
      {messages.map((message: any) => {
        return (
          <li
            key={message.id}
            className='relative flex justify-between gap-x-6 px-3 py-4 hover:bg-gray-50 sm:px-6'
          >
            <div className='flex min-w-0 gap-x-4'>
              <div className='min-w-0 flex-auto'>
                <p className='text-sm font-semibold leading-6 text-gray-900'>
                  <div>
                    <span className='absolute inset-x-0 -top-px bottom-0' />
                    {message.from_email}
                  </div>
                </p>
                <p className='mt-1 flex text-xs leading-5 text-gray-500'>
                  <span className='relative truncate hover:underline'>
                    {message.subject}
                  </span>
                </p>
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-x-4'>
              <div className='hidden sm:flex sm:flex-col sm:items-end'>
                <p className='text-xs leading-5 text-gray-500'>
                  {new Date(message.created_at * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
