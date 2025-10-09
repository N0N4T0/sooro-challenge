import { storage } from './storage'

interface JWTPayload {
  sub: string
  iat: number
  exp: number
  [key: string]: any
}

export const jwt = {

  decode: (token: string): JWTPayload | null => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = parts[1]
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decoded)
    } catch {
      return null
    }
  },


  getUserId: (): string | null => {
    const token = storage.getItem('token')


    if (!token) {

      return null
    }

    const payload = jwt.decode(token)


    const userId = payload?.sub || null


    return userId
  },


  isExpired: (token: string): boolean => {
    const payload = jwt.decode(token)
    if (!payload) return true

    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  }
}
