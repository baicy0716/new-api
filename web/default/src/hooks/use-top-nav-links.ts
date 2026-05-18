import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { useStatus } from '@/hooks/use-status'

const DEFAULT_DOCS_LINK = 'https://docs.newapi.pro'
const DEFAULT_CMS_TOOLS_LINK = 'https://api.kuaigouai.com/share/tools'
const DEFAULT_CMS_SHARE_LINK = 'https://api.kuaigouai.com/share/share'
const DEFAULT_CMS_MARKETPLACE_LINK = 'https://api.kuaigouai.com/share/marketplace'

export type TopNavLink = {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}

// Default navigation configuration
const DEFAULT_HEADER_NAV_MODULES = {
  home: true,
  console: true,
  pricing: { enabled: true, requireAuth: false },
  docs: true,
  about: true,
}

const DEFAULT_CMS_NAV_MODULES = {
  tools: true,
  share: true,
  marketplace: true,
}

/**
 * Generate top navigation links based on HeaderNavModules configuration from backend /api/status
 * Backend format example (stringified JSON):
 * {
 *   home: true,
 *   console: true,
 *   pricing: { enabled: true, requireAuth: false },
 *   docs: true,
 *   about: true
 * }
 */
export function useTopNavLinks(): TopNavLink[] {
  const { t } = useTranslation()
  const { status } = useStatus()
  const { auth } = useAuthStore()

  // Parse HeaderNavModules
  const modules = useMemo(() => {
    const raw = status?.HeaderNavModules
    // If empty string, null, or undefined, use default config
    if (typeof raw !== 'string' || raw.trim() === '') {
      return DEFAULT_HEADER_NAV_MODULES
    }
    try {
      return JSON.parse(raw)
    } catch {
      // Parse failed, use default config
      return DEFAULT_HEADER_NAV_MODULES
    }
  }, [status?.HeaderNavModules])

  // Documentation link (may be external)
  const docsLink: string | undefined = status?.docs_link as string | undefined

  const isAuthed = !!auth?.user

  const links: TopNavLink[] = []

  const cmsNavModules = DEFAULT_CMS_NAV_MODULES

  // Home -> CMS 首页语义
  if (modules?.home !== false) {
    links.push({ title: t('首页'), href: '/' })
  }

  // Console -> 控制中心
  if (modules?.console !== false) {
    links.push({ title: t('控制中心'), href: '/dashboard' })
  }

  // 模型中心：先映射到当前新前端已有的定价/模型广场页
  const pricing = modules?.pricing
  if (pricing && typeof pricing === 'object' && pricing.enabled) {
    const disabled = pricing.requireAuth && !isAuthed
    links.push({ title: t('模型中心'), href: '/pricing', disabled })
  }

  // API 配置：当前 staging 先挂到现有 CMS 页面
  if (cmsNavModules.tools) {
    links.push({
      title: t('API 配置'),
      href: docsLink || DEFAULT_CMS_TOOLS_LINK,
      external: true,
    })
  }

  if (cmsNavModules.share) {
    links.push({
      title: t('快狗分享'),
      href: DEFAULT_CMS_SHARE_LINK,
      external: true,
    })
  }

  if (cmsNavModules.marketplace) {
    links.push({
      title: t('工具集市'),
      href: DEFAULT_CMS_MARKETPLACE_LINK,
      external: true,
    })
  }

  // About -> 关于我们
  if (modules?.about !== false) {
    links.push({ title: t('关于我们'), href: '/about' })
  }

  // docs 开关保留一个兜底出口，防止后台只关心文档入口时整项消失
  if (modules?.docs !== false && !cmsNavModules.tools) {
    links.push({
      title: t('Docs'),
      href: docsLink || DEFAULT_DOCS_LINK,
      external: true,
    })
  }

  return links
}
