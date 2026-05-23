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
import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationButton } from '@/components/notification-button'
import { NotificationDialog } from '@/components/notification-dialog'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
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
  const consoleLinks: TopNavLink[] = [
    { title: t('Overview'), href: '/dashboard/overview' },
    { title: t('Playground'), href: '/playground' },
    { title: t('API Keys'), href: '/keys' },
    { title: t('Wallet'), href: '/wallet' },
  ]
  const links =
    dynamicLinks.length > 0
      ? dynamicLinks
      : navLinks.length > 0
        ? navLinks
        : consoleLinks
  const { systemName, logo, loading, logoLoaded } = useSystemConfig()
  const notifications = useNotifications()

  const leftSection =
    leftContent ||
    (showTopNav ? (
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center gap-3 md:gap-4',
          !isPublicShellRoute && 'justify-center'
        )}
      >
        {isPublicShellRoute ? (
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
        ) : null}

        {links.length > 0 ? (
          <TopNav
            links={links}
            className={cn(
              'min-w-0',
              isPublicShellRoute ? 'flex-1' : 'max-w-full flex-none'
            )}
            variant={isPublicShellRoute ? 'plain' : 'pill'}
          />
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
              <NotificationButton
                unreadCount={notifications.unreadCount}
                onClick={() => notifications.openDialog()}
              />
            )}
            <LanguageSwitcher />
            {showConfigDrawer && <ConfigDrawer />}
            {showProfileDropdown && <ProfileDropdown />}
          </div>
        )}
      </Header>

      {showNotifications && (
        <NotificationDialog
          open={notifications.dialogOpen}
          onOpenChange={notifications.setDialogOpen}
          activeTab={notifications.activeTab}
          onTabChange={notifications.setActiveTab}
          notice={notifications.notice}
          announcements={notifications.announcements}
          loading={notifications.loading}
          onCloseToday={notifications.closeToday}
        />
      )}
    </>
  )
}
