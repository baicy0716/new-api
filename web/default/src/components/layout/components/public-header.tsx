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
import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog } from '@/components/dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { HeaderLogo } from './header-logo'

const CMS_BRAND_LOGO_URL = 'https://i.imgur.com/7Tkqn1t.png'

function isPublicLinkActive(pathname: string, href: string) {
  if (href === '/' || href === '/share/') {
    return pathname === '/' || pathname === '/share/' || pathname === '/share'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function ExternalHeaderLink({
  link,
  className,
  children,
  onClick,
}: {
  link: TopNavLink
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <a
      href={link.href}
      target={link.openInNewTab ? '_blank' : undefined}
      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
      className={className}
      onClick={onClick}
      aria-disabled={link.disabled}
    >
      {children}
    </a>
  )
}

function NavLinkLabel({ link }: { link: TopNavLink }) {
  return (
    <span className='inline-flex items-center gap-1.5'>
      <span>{link.title}</span>
      {link.showIndicatorDot ? (
        <span
          aria-hidden='true'
          className='kg-shell-link-dot inline-block size-1.5 rounded-full'
        />
      ) : null}
    </span>
  )
}

function DesktopNavLink({
  link,
  className,
  children,
}: {
  link: TopNavLink
  className?: string
  children: React.ReactNode
}) {
  if (link.external) {
    return (
      <ExternalHeaderLink link={link} className={className}>
        {children}
      </ExternalHeaderLink>
    )
  }

  return (
    <Link to={link.href} className={className}>
      {children}
    </Link>
  )
}

export interface PublicHeaderProps {
  navLinks?: TopNavLink[]
  mobileLinks?: TopNavLink[]
  navContent?: React.ReactNode
  showThemeSwitch?: boolean
  showLanguageSwitcher?: boolean
  logo?: React.ReactNode
  siteName?: string
  homeUrl?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  showNavigation?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  variant?: 'floating' | 'cms'
  className?: string
}

export function PublicHeader(props: PublicHeaderProps) {
  const {
    navLinks = defaultTopNavLinks,
    showThemeSwitch = true,
    showLanguageSwitcher = true,
    logo: customLogo,
    siteName: customSiteName,
    homeUrl = '/',
    showAuthButtons = true,
    showNotifications = true,
    variant = 'floating',
  } = props

  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { auth } = useAuthStore()
  const {
    systemName,
    logo: systemLogo,
    loading,
    logoLoaded,
  } = useSystemConfig()
  const dynamicLinks = useTopNavLinks()
  const notifications = useNotifications()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const isAuthenticated = !!auth.user
  const displaySiteName = customSiteName || systemName
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const isCmsVariant = variant === 'cms'
  const primaryLinks = isCmsVariant
    ? links.filter(
        (link) =>
          [
            '/share/',
            '/share/models',
            '/share/tools',
            '/share/playground',
          ].includes(link.href) || link.href === '/share/changelog'
      )
    : links
  const overflowLinks = isCmsVariant
    ? links.filter((link) => !primaryLinks.includes(link))
    : []
  const hasActiveOverflowLink = overflowLinks.some((link) =>
    isPublicLinkActive(pathname, link.href)
  )
  const hasOverflowIndicator = overflowLinks.some(
    (link) => link.showIndicatorDot
  )

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-50',
          props.className
        )}
      >
        <div
          className={cn(
            isCmsVariant
              ? 'kg-shell-cms-header-inner pointer-events-auto mx-auto max-w-7xl px-4 pt-3 md:px-6'
              : 'pointer-events-auto mx-auto max-w-7xl px-4 pt-3 md:px-6'
          )}
        >
          <nav
            className={cn(
              'flex items-center justify-between',
              isCmsVariant
                ? 'kg-shell-cms-nav h-14 rounded-[26px] px-4'
                : 'bg-background/88 ring-border/60 h-14 rounded-2xl px-4 shadow-sm ring-[0.5px] backdrop-blur-xl'
            )}
          >
            <Link
              to={homeUrl}
              className='kg-shell-brand flex shrink-0 items-center gap-2.5'
            >
              {isCmsVariant ? (
                <>
                  <span className='kg-shell-brand-mark flex size-8 shrink-0 items-center justify-center'>
                    <img src={CMS_BRAND_LOGO_URL} alt='KuaiGouAI' />
                  </span>
                  <span className='kg-shell-brand-word' aria-label='KuaiGouAI'>
                    KuaiGou<span>AI</span>
                  </span>
                </>
              ) : (
                <>
                  <div className='flex size-7 shrink-0 items-center justify-center'>
                    {loading ? (
                      <Skeleton className='size-full rounded-lg' />
                    ) : customLogo ? (
                      customLogo
                    ) : (
                      <HeaderLogo
                        src={systemLogo}
                        loading={loading}
                        logoLoaded={logoLoaded}
                        className='size-full rounded-lg object-contain'
                      />
                    )}
                  </div>
                  <span className='kg-shell-brand-text text-sm font-semibold tracking-tight'>
                    {loading ? (
                      <Skeleton className='h-4 w-16' />
                    ) : (
                      displaySiteName
                    )}
                  </span>
                </>
              )}
            </Link>

            <div className='hidden min-w-0 flex-1 items-center xl:flex'>
              <div className='kg-shell-links flex min-w-0 flex-1 items-center'>
                {primaryLinks.map((link, i) => {
                  const isActive = isPublicLinkActive(pathname, link.href)
                  return (
                    <DesktopNavLink
                      key={i}
                      link={link}
                      className={cn(
                        'kg-shell-link rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap',
                        link.showIndicatorDot && 'kg-shell-link-highlight',
                        isActive
                          ? 'kg-shell-link-active text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <NavLinkLabel link={{ ...link, title: t(link.title) }} />
                    </DesktopNavLink>
                  )
                })}

                {overflowLinks.length > 0 && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                      render={
                        <button
                          className={cn(
                            'kg-shell-link kg-shell-more-trigger inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap',
                            hasActiveOverflowLink
                              ? 'kg-shell-link-active text-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        />
                      }
                    >
                      <span>{t('更多')}</span>
                      {hasOverflowIndicator ? (
                        <span
                          aria-hidden='true'
                          className='kg-shell-link-dot inline-block size-1.5 rounded-full'
                        />
                      ) : null}
                      <ChevronDown className='size-3.5 opacity-70' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='center'
                      sideOffset={12}
                      className='kg-shell-more-menu w-44 rounded-2xl p-1.5'
                    >
                      {overflowLinks.map((link, i) => {
                        const isActive = isPublicLinkActive(pathname, link.href)
                        const itemClassName = cn(
                          'kg-shell-more-item flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm',
                          link.showIndicatorDot && 'kg-shell-more-highlight',
                          isActive
                            ? 'kg-shell-more-item-active text-foreground'
                            : 'text-muted-foreground'
                        )

                        if (link.external) {
                          return (
                            <DropdownMenuItem
                              key={i}
                              render={
                                <ExternalHeaderLink
                                  link={link}
                                  className={itemClassName}
                                />
                              }
                            >
                              <NavLinkLabel
                                link={{ ...link, title: t(link.title) }}
                              />
                            </DropdownMenuItem>
                          )
                        }

                        return (
                          <DropdownMenuItem
                            key={i}
                            render={
                              <Link to={link.href} className={itemClassName} />
                            }
                          >
                            <NavLinkLabel
                              link={{ ...link, title: t(link.title) }}
                            />
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className='kg-shell-toolbar flex shrink-0 items-center'>
                {(showLanguageSwitcher ||
                  showThemeSwitch ||
                  showNotifications) && (
                  <div className='bg-border/40 mx-2 h-4 w-px' />
                )}

                {showLanguageSwitcher && <LanguageSwitcher />}
                {showThemeSwitch && <ThemeSwitch />}
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

                {showAuthButtons && (
                  <>
                    <div className='bg-border/40 mx-1 h-4 w-px' />
                    {loading ? (
                      <Skeleton className='h-9 w-32 rounded-full' />
                    ) : isAuthenticated ? (
                      <div className='kg-shell-cta flex items-center gap-2'>
                        <Button
                          size='sm'
                          className='kg-shell-btn kg-shell-btn-primary h-9 rounded-full px-4 text-sm font-medium'
                          render={<Link to='/share/console' />}
                        >
                          {t('控制中心')}
                        </Button>
                        <ProfileDropdown />
                      </div>
                    ) : (
                      <div className='kg-shell-cta flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='kg-shell-btn kg-shell-btn-ghost h-9 rounded-full px-4 text-sm font-medium'
                          render={<Link to='/share/login' />}
                        >
                          {t('登录')}
                        </Button>
                        <Button
                          size='sm'
                          className='kg-shell-btn kg-shell-btn-primary h-9 rounded-full px-4 text-sm font-medium'
                          render={<Link to='/share/register' />}
                        >
                          {t('免费注册')}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2 xl:hidden'>
              {showThemeSwitch && <ThemeSwitch />}
              {showAuthButtons && !loading && isAuthenticated && (
                <ProfileDropdown />
              )}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-9'
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={t('Toggle navigation menu')}
              >
                <div className='relative size-4'>
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current',
                      mobileOpen ? 'top-[7px] rotate-45' : 'top-[3px]'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 top-[7px] block h-[1.5px] rounded-full bg-current',
                      mobileOpen ? 'scale-x-0 opacity-0' : 'opacity-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current',
                      mobileOpen ? 'top-[7px] -rotate-45' : 'top-[11px]'
                    )}
                  />
                </div>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div
        className={cn(
          'bg-background/98 fixed inset-0 z-40 backdrop-blur-2xl xl:pointer-events-none xl:hidden',
          mobileOpen
            ? 'pointer-events-auto block'
            : 'pointer-events-none hidden'
        )}
      >
        <div className='flex h-full flex-col justify-between px-8 pt-20 pb-10'>
          <nav className='flex flex-col gap-1'>
            {links.map((link, i) => {
              const isActive = isPublicLinkActive(pathname, link.href)
              const linkClassName = cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium tracking-tight',
                link.showIndicatorDot && 'kg-shell-link-highlight',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )

              if (link.external) {
                return (
                  <ExternalHeaderLink
                    key={i}
                    link={link}
                    onClick={() => setMobileOpen(false)}
                    className={linkClassName}
                  >
                    <NavLinkLabel link={{ ...link, title: t(link.title) }} />
                  </ExternalHeaderLink>
                )
              }

              return (
                <Link
                  key={i}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={linkClassName}
                >
                  <NavLinkLabel link={{ ...link, title: t(link.title) }} />
                </Link>
              )
            })}
          </nav>

          <div className='flex flex-col gap-3'>
            {showAuthButtons &&
              (isAuthenticated ? (
                <Link
                  to='/share/console'
                  onClick={() => setMobileOpen(false)}
                  className='bg-foreground text-background inline-flex h-10 items-center justify-center rounded-lg text-sm font-medium'
                >
                  {t('控制中心')}
                </Link>
              ) : (
                <div className='flex flex-col gap-3'>
                  <Link
                    to='/share/login'
                    onClick={() => setMobileOpen(false)}
                    className='bg-foreground text-background inline-flex h-10 items-center justify-center rounded-lg text-sm font-medium'
                  >
                    {t('登录')}
                  </Link>
                  <Link
                    to='/share/register'
                    onClick={() => setMobileOpen(false)}
                    className='border-border text-foreground inline-flex h-10 items-center justify-center rounded-lg border text-sm font-medium'
                  >
                    {t('免费注册')}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* notification popover now lives inline above with the icon button */}
      {/* NOTE: upstream rc.11 introduces an auth-prompt Dialog here referencing
          authPromptTarget/closeAuthPrompt/navigateToSignIn/authPromptSecondsLeft —
          deferred to a follow-up because integrating it requires adding ~5 hooks
          + a trigger in the link-click handler. Tracked for next pass. */}
    </>
  )
}
