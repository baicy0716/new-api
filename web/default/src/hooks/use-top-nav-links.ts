import { useTranslation } from 'react-i18next'
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
      href: '/',
    },
    {
      title: t('控制中心'),
      href: '/dashboard',
    },
    {
      title: t('模型中心'),
      href: '/pricing',
    },
    {
      title: t('API 配置'),
      href: '/tools',
    },
    {
      title: t('快狗分享'),
      href: '/share-center',
    },
    {
      title: t('工具集市'),
      href: '/marketplace',
    },
    {
      title: t('关于我们'),
      href: '/about',
    },
  ]
}
