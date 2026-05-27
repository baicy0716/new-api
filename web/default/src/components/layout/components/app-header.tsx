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
import { ChevronDown } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { defaultTopNavLinks } from '../config/top-nav.config'
import { type TopNavLink } from '../types'
import { Header } from './header'
import { HeaderLogo } from './header-logo'
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
  const { t } = useTranslation()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isPublicShellRoute =
    pathname === '/' || pathname === '/share' || pathname.startsWith('/share/')

  const dynamicLinks = useTopNavLinks()
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  // 主+溢出：把首 5 项作为视觉主链接，剩下塞进"更多"下拉。跟 public-header 的
  // CMS variant 一样的分割逻辑，保证 dashboard 头部 10 个链接不挤爆容器，
  // 同时用户仍能进去任何一个 share 页（点 logo 回主站，点更多看其余 5 项）。
  const PRIMARY_LIMIT = 5
  const primaryLinks = links.slice(0, PRIMARY_LIMIT)
  const overflowLinks = links.slice(PRIMARY_LIMIT)
  const { systemName, logo, loading, logoLoaded } = useSystemConfig()
  const notifications = useNotifications()

  const leftSection =
    leftContent ||
    (showTopNav ? (
      <div className='flex min-w-0 flex-1 items-center gap-3 md:gap-4'>
        {/* 品牌永远露出（之前只在 isPublicShellRoute 时才有 → dashboard
           上侧边栏顶部 logo 不见而且头部 nav 没 logo，看着不平衡） */}
        <Link
          to='/share'
          className='hidden min-w-0 shrink-0 items-center gap-2 md:flex'
        >
          <div className='bg-muted/40 flex size-8 shrink-0 items-center justify-center rounded-xl border'>
            {loading ? (
              <Skeleton className='size-6 rounded-lg' />
            ) : (
              <HeaderLogo
                src={logo}
                loading={loading}
                logoLoaded={logoLoaded}
                className='size-6 rounded-lg object-contain'
              />
            )}
          </div>
          <div className='hidden min-w-0 xl:block'>
            {loading ? (
              <Skeleton className='h-4 w-28' />
            ) : (
              <span className='block truncate text-sm font-semibold tracking-tight'>
                {systemName}
              </span>
            )}
          </div>
        </Link>

        {primaryLinks.length > 0 ? (
          <div className='flex min-w-0 flex-1 items-center gap-1'>
            <TopNav
              links={primaryLinks}
              className={cn(
                'min-w-0',
                isPublicShellRoute ? 'flex-1' : 'flex-none'
              )}
              variant={isPublicShellRoute ? 'plain' : 'pill'}
            />
            {/* 溢出"更多"下拉：把 PRIMARY_LIMIT 之后的链接收纳进来 */}
            {overflowLinks.length > 0 ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  render={
                    <button
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap',
                        'text-muted-foreground hover:text-foreground transition-colors'
                      )}
                    />
                  }
                >
                  <span>{t('更多')}</span>
                  <ChevronDown className='size-3.5 opacity-70' />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='start'
                  sideOffset={8}
                  className='w-44 rounded-2xl p-1.5'
                >
                  {overflowLinks.map((link, i) => (
                    <DropdownMenuItem
                      key={i}
                      render={
                        <Link
                          to={link.href}
                          className='flex w-full items-center rounded-xl px-3 py-2 text-sm'
                        />
                      }
                    >
                      {t(link.title)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        ) : null}
      </div>
    ) : null)

  return (
    <>
      <Header
        className={cn(
          !isPublicShellRoute &&
            'border-border/60 bg-background/85 supports-[backdrop-filter]:bg-background/70 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
        )}
        contentClassName={cn(!isPublicShellRoute && 'items-start pt-3.5')}
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
