import APIBase from './httpBase'
import type { SessionUser } from '@/types'

export interface SessionResponse {
  token: string
  user: SessionUser
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string
}

class AuthService extends APIBase {
  async login(email: string, password: string): Promise<SessionResponse> {
    const { data } = await this.post<SessionResponse>('auth/login', {
      email,
      password,
    })
    return data
  }

  async register(payload: RegisterPayload): Promise<SessionResponse> {
    const { data } = await this.post<SessionResponse>('auth/register', payload)
    return data
  }

  async me(): Promise<SessionUser> {
    const { data } = await this.get<{ user: SessionUser }>('auth/me')
    return data.user
  }

  async changePassword(current: string, next: string): Promise<SessionUser> {
    const { data } = await this.put<{ user: SessionUser }>('auth/password', { current, next })
    return data.user
  }

  async updateProfile(payload: { name: string; phone: string }): Promise<SessionUser> {
    const { data } = await this.put<{ user: SessionUser }>('auth/profile', payload)
    return data.user
  }

  /** El API responde igual exista o no el correo: no revela quién tiene cuenta. */
  async forgotPassword(email: string): Promise<void> {
    await this.post<{ ok: boolean }>('auth/forgot-password', { email })
  }

  /** Devuelve una sesión lista: tras definir la contraseña el alumno ya queda adentro. */
  async resetPassword(token: string, password: string): Promise<SessionResponse> {
    const { data } = await this.post<SessionResponse>('auth/reset-password', { token, password })
    return data
  }
}

export const authService = new AuthService()
