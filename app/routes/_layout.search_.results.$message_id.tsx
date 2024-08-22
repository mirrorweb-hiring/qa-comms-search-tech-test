import { type LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData, useParams } from '@remix-run/react'
import { requireSession } from '~/lib/auth'
import { api } from '~/lib/utils'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { session } = await requireSession(request)

  const messageId = params.message_id
  const message = await api(`/messages/${messageId}`, {
    headers: {
      cookie: session,
    },
  })

  return json({ message })
}

export default function Message() {
  // @ts-ignore
  const { message } = useLoaderData()
  const params = useParams()
  if (!params.message_id) {
    return <div></div>
  }

  return (
    <div className='relative h-full'>
      <div className='h-full mx-auto max-w-3xl px-8'>
        <div className='h-full overflow-hidden bg-white ring-1 ring-gray-900/5 rounded-xl shadow'>
          <div className='h-full p-8 space-y-6'>
            <div className='space-y-1'>
              <h2 className='text-lg font-semibold leading-6 text-gray-900'>
                {message.subject}
              </h2>
              <p className='text-sm text-gray-500'>{message.from_email}</p>
            </div>

            <p>{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
