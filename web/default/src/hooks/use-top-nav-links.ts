import { useTranslation } from 'react-i18next'
import type { TopNavLink } from '@/components/layout'

export function useTopNavLinks(): TopNavLink[] {
  const { t } = useTranslation()

  return [
    {
      title: t('首页'),
      href: '/share/',
    },
    {
      title: t('模型中心'),
      href: '/share/models',
    },
    {
      title: t('API 配置'),
      href: '/share/tools',
    },
    {
      title: t('快狗分享'),
      href: '/share/share',
    },
    {
      title: t('工具集市'),
      href: '/share/marketplace',
    },
    {
      title: t('常见问题'),
      href: '/share/faq',
    },
    {
      title: t('体验中心'),
      href: '/share/playground',
    },
    {
      title: t('海外代理'),
      href: '/share/services',
    },
    {
      title: t('关于我们'),
      href: '/share/about',
    },
    {
      title: t('更新动态'),
      href: '/share/changelog',
      showIndicatorDot: true,
    },
  ]
}
