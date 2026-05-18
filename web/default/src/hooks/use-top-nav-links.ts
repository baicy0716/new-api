import { useTranslation } from 'react-i18next'
const DEFAULT_CMS_HOME_LINK = 'https://api.kuaigouai.com/share/'
const DEFAULT_CMS_MODELS_LINK = 'https://api.kuaigouai.com/share/models'
const DEFAULT_CMS_TOOLS_LINK = 'https://api.kuaigouai.com/share/tools'
const DEFAULT_CMS_SHARE_LINK = 'https://api.kuaigouai.com/share/share'
const DEFAULT_CMS_MARKETPLACE_LINK = 'https://api.kuaigouai.com/share/marketplace'
const DEFAULT_CMS_ABOUT_LINK = 'https://api.kuaigouai.com/share/about'

export type TopNavLink = {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  openInNewTab?: boolean
}

export function useTopNavLinks(): TopNavLink[] {
  const { t } = useTranslation()

  return [
    {
      title: t('首页'),
      href: DEFAULT_CMS_HOME_LINK,
      external: true,
    },
    {
      title: t('控制中心'),
      href: '/dashboard',
    },
    {
      title: t('模型中心'),
      href: DEFAULT_CMS_MODELS_LINK,
      external: true,
    },
    {
      title: t('API 配置'),
      href: DEFAULT_CMS_TOOLS_LINK,
      external: true,
    },
    {
      title: t('快狗分享'),
      href: DEFAULT_CMS_SHARE_LINK,
      external: true,
    },
    {
      title: t('工具集市'),
      href: DEFAULT_CMS_MARKETPLACE_LINK,
      external: true,
    },
    {
      title: t('关于我们'),
      href: DEFAULT_CMS_ABOUT_LINK,
      external: true,
    },
  ]
}
