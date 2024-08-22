import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import '~/tailwind.css'

export const meta: MetaFunction = () => {
  return [{ title: 'Comms Search' }]
}

export default function App() {
  return <Outlet />
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full bg-gray-100'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
