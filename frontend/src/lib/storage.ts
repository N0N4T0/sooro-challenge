export const storage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(key)
      return value
    }
    return null
  },

  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  },

  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }
}
