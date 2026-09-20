import APIBase from './httpBase'
import type { LoyaltyCard, MyCourse, MyCourseDetail, Playback, Ticket } from '@/types'

class MeService extends APIBase {
  /** Incluye accesos vencidos o revocados: el estado lo indica `access.status`. */
  async courses(): Promise<MyCourse[]> {
    const { data } = await this.get<MyCourse[]>('me/courses')
    return data
  }

  async course(slug: string): Promise<MyCourseDetail> {
    const { data } = await this.get<MyCourseDetail>(`me/courses/${encodeURIComponent(slug)}`)
    return data
  }

  /** La URL firmada del reproductor la arma el backend; caduca, por eso se pide por lección. */
  async playback(lessonId: string): Promise<Playback> {
    const { data } = await this.get<Playback>(`lessons/${lessonId}/playback`)
    return data
  }

  async complete(lessonId: string, completed: boolean): Promise<void> {
    await this.post<{ ok: boolean }>(`lessons/${lessonId}/complete`, { completed })
  }

  async tickets(): Promise<Ticket[]> {
    const { data } = await this.get<Ticket[]>('me/tickets')
    return data
  }

  async loyalty(): Promise<LoyaltyCard> {
    const { data } = await this.get<LoyaltyCard>('me/loyalty')
    return data
  }
}

export const meService = new MeService()
