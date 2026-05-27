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
import { useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/use-notifications'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { defaultTopNavLinks } from '../config/top-nav.config'
import { type TopNavLink } from '../types'
import { Header } from './header'
import { TopNav } from './top-nav'

type AppHeaderProps = {
  navLinks?: TopNavLink[]
  showTopNav?: boolean
  leftContent?: React.ReactNode
  showSearch?: boolean
  rightContent?: React.ReactNode
  showNotifications?: boolean
  showConfigDrawer?: boolean
  showProfileDropdown?: boolean
}

export function AppHeader({
  navLinks = defaultTopNavLinks,
  showTopNav = true,
  leftContent,
  showSearch = true,
  rightContent,
  showNotifications = true,
  showConfigDrawer = true,
  showProfileDropdown = true,
}: AppHeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isPublicShellRoute =
    pathname === '/' || pathname === '/share' || pathname.startsWith('/share/')

  // sidebar 已经渲染了 brand logo，所以 header 不再重复加 logo；
  // 全套 share 链接平铺展示，不收缩，不溢出（依赖 layout 给 sidebar 留出
  // 左侧固定列，header 拿到的水平空间足够装下 10 项 + 右侧 widgets）。
  const dynamicLinks = useTopNavLinks()
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const notifications = useNotifications()

  const leftSection =
    leftContent ||
    (showTopNav && links.length > 0 ? (
      <TopNav
        links={links}
        className='min-w-0 flex-1'
        variant={isPublicShellRoute ? 'plain' : 'pill'}
      />
    ) : null)

  return (
    <>
      <Header
        className={cn(
          !isPublicShellRoute &&
            'border-sidebar-border bg-background/85 supports-[backdrop-filter]:bg-background/70 backdrop-blur-xl border-b'
        )}
        contentClassName={cn(!isPublicShellRoute && 'items-center')}
      >
        {leftSection}
        {rightContent ?? (
          <div className='ms-auto flex shrink-0 items-center gap-2 sm:gap-3'>
            {showSearch && <Search />}
            {showNotifications && (
              <NotificationPopover
                open={notifications.popoverOpen}
                onOpenChange={notifications.setPopoverOpen}
                unreadCount={notifications.unreadCount}
                activeTab={notifications.activeTab}
                onTabChange={notifications.setActiveTab}
                notice={notifications.notice}
                announcements={notifications.announcements}
                loading={notifications.loading}
              />
            )}
            <LanguageSwitcher />
            {showConfigDrawer && <ConfigDrawer />}
            {showProfileDropdown && <ProfileDropdown />}
          </div>
        )}
      </Header>
    </>
  )
}
