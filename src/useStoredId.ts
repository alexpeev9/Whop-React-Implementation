import { useCallback, useState } from 'react'

export const useStoredId = (key: string) => {
  const [value, setValue] = useState(() => sessionStorage.getItem(key) ?? '')

  const update = useCallback(
    (next: string) => {
      setValue(next)
      if (next) sessionStorage.setItem(key, next)
      else sessionStorage.removeItem(key)
    },
    [key],
  )

  return [value, update] as const
}

export const revealElement = (id: string) => {
  window.requestAnimationFrame(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}
