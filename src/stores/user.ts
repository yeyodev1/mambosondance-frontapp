import { defineStore } from 'pinia'
import { authService, type RegisterPayload } from '@/services/auth.service'
import type { SessionUser } from '@/types'

const TOKEN_KEY = 'access_token'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as SessionUser | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.user),
    isAdmin: (s) => s.user?.accountType === 'admin',
    hasToken: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  },

  actions: {
    setSession(token: string, user: SessionUser) {
      try {
        localStorage.setItem(TOKEN_KEY, token)
      } catch {
        // Modo privado: la sesión dura lo que dure la pestaña.
      }
      this.user = user
    },

    async login(email: string, password: string): Promise<SessionUser> {
      const { token, user } = await authService.login(email, password)
      this.setSession(token, user)
      return user
    },

    /** Crea la cuenta y deja la sesión abierta, igual que un login. */
    async register(payload: RegisterPayload): Promise<SessionUser> {
      const { token, user } = await authService.register(payload)
      this.setSession(token, user)
      return user
    },

    async updateProfile(payload: { name: string; phone: string }): Promise<SessionUser> {
      this.user = await authService.updateProfile(payload)
      return this.user
    },

    async changePassword(current: string, next: string): Promise<void> {
      this.user = await authService.changePassword(current, next)
    },

    /** Recupera la sesión desde el token guardado, verificándola con el API. */
    async restore(): Promise<SessionUser | null> {
      if (this.user) return this.user
      if (!localStorage.getItem(TOKEN_KEY)) return null

      this.loading = true
      try {
        this.user = await authService.me()
        return this.user
      } catch {
        this.clear()
        return null
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.user = null
      try {
        localStorage.removeItem(TOKEN_KEY)
      } catch {
        /* nada que limpiar */
      }
    },
  },
})
