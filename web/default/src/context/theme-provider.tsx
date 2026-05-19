import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME = 'system'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const CMS_THEME_STORAGE_KEY = 'kg-theme'

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system'
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  const cookieTheme = getCookie(storageKey)
  if (isTheme(cookieTheme)) {
    return cookieTheme
  }

  if (typeof window === 'undefined') {
    return defaultTheme
  }

  try {
    const localTheme = window.localStorage.getItem(storageKey)
    if (isTheme(localTheme)) {
      return localTheme
    }

    const legacyCmsTheme = window.localStorage.getItem(CMS_THEME_STORAGE_KEY)
    if (legacyCmsTheme === 'dark' || legacyCmsTheme === 'light') {
      return legacyCmsTheme
    }
  } catch {
    return defaultTheme
  }

  return defaultTheme
}

function syncThemeStorage(storageKey: string, theme: Theme): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(storageKey, theme)

    if (theme === 'system') {
      window.localStorage.removeItem(CMS_THEME_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(CMS_THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage write failures and keep the DOM theme authoritative.
  }
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'light',
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  )

  // Optimized: Memoize the resolved theme calculation to prevent unnecessary re-computations
  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme as ResolvedTheme
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark') // Remove existing theme classes
      root.classList.add(currentResolvedTheme) // Add the new theme class
      root.setAttribute('data-theme', currentResolvedTheme)
    }

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        applyTheme(systemTheme)
      }
    }

    applyTheme(resolvedTheme)
    syncThemeStorage(storageKey, theme)

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [storageKey, theme, resolvedTheme])

  const setTheme = (theme: Theme) => {
    setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
    syncThemeStorage(storageKey, theme)
    _setTheme(theme)
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    syncThemeStorage(storageKey, DEFAULT_THEME)
    _setTheme(DEFAULT_THEME)
  }

  const contextValue = {
    defaultTheme,
    resolvedTheme,
    resetTheme,
    theme,
    setTheme,
  }

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
