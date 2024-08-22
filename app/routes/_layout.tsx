import { NavLink, Outlet } from '@remix-run/react'
import { classNames } from '~/lib/utils'

export default function AppLayout() {
  return (
    <div className='min-h-full'>
      <nav className='bg-white shadow-sm'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <div className='flex flex-shrink-0 items-center'>
                <img
                  alt='Comms Search'
                  src='https://tailwindui.com/img/logos/mark.svg?color=pink&shade=600'
                  className='block h-8 w-auto'
                />
              </div>
              <div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
                <NavLink
                  to='/dashboard'
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'border-pink-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                    )
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to='/search'
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'border-pink-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                    )
                  }
                >
                  Search
                </NavLink>
              </div>
            </div>
            <div className='flex'>
              <div className='flex items-center'>
                <a
                  href=''
                  className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  )
}
