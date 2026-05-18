export const DEFAULT_AUTH_REDIRECT = '/dashboard'

function toInternalPath(
  pathname?: string,
  search?: string,
  hash?: string,
  fallback: string = DEFAULT_AUTH_REDIRECT
) {
  if (!pathname || typeof pathname !== 'string' || !pathname.startsWith('/')) {
    return fallback
  }

  return `${pathname}${search || ''}${hash || ''}`
}

export function normalizeInternalRedirect(
  target?: string,
  fallback: string = DEFAULT_AUTH_REDIRECT
) {
  if (typeof target !== 'string') return fallback

  const trimmed = target.trim()
  if (!trimmed) return fallback

  if (trimmed.startsWith('/')) {
    return trimmed.startsWith('//') ? fallback : trimmed
  }

  try {
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost'
    const parsed = new URL(trimmed, base)
    const baseOrigin = new URL(base).origin
    if (parsed.origin !== baseOrigin) return fallback
    return toInternalPath(parsed.pathname, parsed.search, parsed.hash, fallback)
  } catch {
    return fallback
  }
}

export function buildRedirectFromLocation(
  location: {
    href?: string
    pathname?: string
    search?: string | Record<string, unknown>
    searchStr?: string
    hash?: string
  },
  fallback: string = DEFAULT_AUTH_REDIRECT
) {
  if (typeof location.href === 'string' && location.href.trim()) {
    return normalizeInternalRedirect(location.href, fallback)
  }

  const search =
    typeof location.search === 'string'
      ? location.search
      : typeof location.searchStr === 'string'
        ? location.searchStr
        : ''

  return toInternalPath(location.pathname, search, location.hash, fallback)
}
