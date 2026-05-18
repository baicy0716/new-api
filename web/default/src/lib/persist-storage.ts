import type { PersistStorage, StorageValue } from 'zustand/middleware'

export function createSafePersistStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name) => {
      if (typeof window === 'undefined') return null

      try {
        const raw = window.localStorage.getItem(name)
        if (!raw) return null
        return JSON.parse(raw) as StorageValue<T>
      } catch {
        try {
          window.localStorage.removeItem(name)
        } catch {
          /* empty */
        }
        return null
      }
    },
    setItem: (name, value) => {
      if (typeof window === 'undefined') return

      try {
        window.localStorage.setItem(name, JSON.stringify(value))
      } catch {
        /* empty */
      }
    },
    removeItem: (name) => {
      if (typeof window === 'undefined') return

      try {
        window.localStorage.removeItem(name)
      } catch {
        /* empty */
      }
    },
  }
}
