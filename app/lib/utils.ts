export const API_URL = 'http://localhost:8080'

export async function api(url: string, options?: RequestInit) {
  const res = await fetch(API_URL + url, options)
  return await res.json()
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
