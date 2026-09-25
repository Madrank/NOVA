import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi, tokenStore } from '@/services/auth'
import type { LoginInput, PublicUser, RegisterInput } from '@/types/auth'
import type { AuthStatus } from '@/auth/types'
import { AuthContext } from '@/auth/context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() => (tokenStore.get() ? 'loading' : 'anonymous'))
  const [user, setUser] = useState<PublicUser | null>(null)

  const applySession = useCallback((session: { user: PublicUser; token: string }) => {
    tokenStore.set(session.token)
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  useEffect(() => {
    const token = tokenStore.get()
    if (!token) {
      return
    }
    let cancelled = false
    authApi
      .me(token)
      .then(({ user: profile }) => {
        if (!cancelled) {
          setUser(profile)
          setStatus('authenticated')
        }
      })
      .catch(() => {
        if (!cancelled) {
          tokenStore.clear()
          setStatus('anonymous')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async (input: LoginInput) => {
      const session = await authApi.login(input)
      applySession(session)
    },
    [applySession],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const session = await authApi.register(input)
      applySession(session)
    },
    [applySession],
  )

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
    setStatus('anonymous')
  }, [])

  const value = useMemo(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}