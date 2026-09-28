import { useEffect, useRef, useState } from 'react'

export interface AsyncResult<T> {
  value: T | null
  error: boolean
  loading: boolean
  reload: () => void
}

export function useAsyncData<T>(key: string, loader: () => Promise<T>): AsyncResult<T> {
  const loaderRef = useRef(loader)
  const [token, setToken] = useState({ key: '', nonce: 0 })
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState(false)

  const activeKey = `${key}:${token.nonce}`

  useEffect(() => {
    loaderRef.current = loader
  })

  useEffect(() => {
    if (!key) return
    let cancelled = false
    loaderRef.current()
      .then((result) => {
        if (cancelled) return
        setValue(result)
        setError(false)
        setToken((previous) => ({ key, nonce: previous.nonce }))
      })
      .catch(() => {
        if (cancelled) return
        setValue(null)
        setError(true)
        setToken((previous) => ({ key, nonce: previous.nonce }))
      })
    return () => {
      cancelled = true
    }
  }, [key, token.nonce])

  return {
    value,
    error,
    loading: token.key !== activeKey,
    reload: () => setToken((previous) => ({ key: '', nonce: previous.nonce + 1 })),
  }
}