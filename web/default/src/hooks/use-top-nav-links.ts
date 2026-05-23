/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useTranslation } from 'react-i18next'
import type { TopNavLink } from '@/components/layout/types'

export function useTopNavLinks(): TopNavLink[] {
  const { t } = useTranslation()

  return [
    { title: t('首页'), href: '/share/' },
    { title: t('模型中心'), href: '/share/models' },
    { title: t('API 配置'), href: '/share/tools' },
    { title: t('快狗分享'), href: '/share/share' },
    { title: t('工具集市'), href: '/share/marketplace' },
    { title: t('常见问题'), href: '/share/faq' },
    { title: t('体验中心'), href: '/share/playground' },
    { title: t('海外代理'), href: '/share/services' },
    { title: t('关于我们'), href: '/share/about' },
    {
      title: t('更新动态'),
      href: '/share/changelog',
      showIndicatorDot: true,
    },
  ]
}
