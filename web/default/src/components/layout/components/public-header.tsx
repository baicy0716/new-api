import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
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
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationButton } from '@/components/notification-button'
import { NotificationDialog } from '@/components/notification-dialog'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { HeaderLogo } from './header-logo'

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
  children: React.ReactNode
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
    homeUrl = '/share/',
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

  const user = auth.user
  const isAuthenticated = !!user
  const displaySiteName = customSiteName || systemName
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const isCmsVariant = variant === 'cms'
  const primaryLinks = isCmsVariant
    ? links.filter((link) =>
        ['/share/', '/share/models', '/share/tools', '/share/playground'].includes(
          link.href
        ) || link.href === '/share/changelog'
      )
    : links
  const overflowLinks = isCmsVariant
    ? links.filter((link) => !primaryLinks.includes(link))
    : []
  const hasActiveOverflowLink = overflowLinks.some((link) =>
    isPublicLinkActive(pathname, link.href)
  )
  const hasOverflowIndicator = overflowLinks.some((link) => link.showIndicatorDot)

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
            {/* Logo */}
            <Link
              to={homeUrl}
              className='kg-shell-brand flex shrink-0 items-center gap-2.5'
            >
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
                {loading ? <Skeleton className='h-4 w-16' /> : displaySiteName}
              </span>
            </Link>

            {/* Desktop nav */}
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
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'kg-shell-link kg-shell-more-trigger inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap',
                          hasActiveOverflowLink
                            ? 'kg-shell-link-active text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span>{t('更多')}</span>
                        {hasOverflowIndicator ? (
                          <span
                            aria-hidden='true'
                            className='kg-shell-link-dot inline-block size-1.5 rounded-full'
                          />
                        ) : null}
                        <ChevronDown className='size-3.5 opacity-70' />
                      </button>
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
                            <DropdownMenuItem key={i} asChild>
                              <ExternalHeaderLink
                                link={link}
                                className={itemClassName}
                              >
                                <NavLinkLabel
                                  link={{ ...link, title: t(link.title) }}
                                />
                              </ExternalHeaderLink>
                            </DropdownMenuItem>
                          )
                        }

                        return (
                          <DropdownMenuItem key={i} asChild>
                            <Link to={link.href} className={itemClassName}>
                              <NavLinkLabel
                                link={{ ...link, title: t(link.title) }}
                              />
                            </Link>
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
                  <NotificationButton
                    unreadCount={notifications.unreadCount}
                    onClick={() => notifications.openDialog()}
                  />
                )}

                {showAuthButtons && (
                  <>
                    <div className='bg-border/40 mx-1 h-4 w-px' />
                    {loading ? (
                      <Skeleton className='h-8 w-32 rounded-lg' />
                    ) : isAuthenticated ? (
                      <div className='kg-shell-cta flex items-center gap-2'>
                        <Button
                          size='sm'
                          className='kg-shell-btn kg-shell-btn-primary h-8 rounded-lg px-3.5 text-xs font-medium'
                          asChild
                        >
                          <Link to='/share/console'>{t('控制中心')}</Link>
                        </Button>
                        <ProfileDropdown />
                      </div>
                    ) : (
                      <div className='kg-shell-cta flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='kg-shell-btn kg-shell-btn-ghost h-8 rounded-lg px-3.5 text-xs font-medium'
                          asChild
                        >
                          <Link to='/share/login'>{t('登录')}</Link>
                        </Button>
                        <Button
                          size='sm'
                          className='kg-shell-btn kg-shell-btn-primary h-8 rounded-lg px-3.5 text-xs font-medium'
                          asChild
                        >
                          <Link to='/share/register'>{t('免费注册')}</Link>
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mobile: compact actions + hamburger */}
            <div className='flex items-center gap-2 xl:hidden'>
              {showThemeSwitch && <ThemeSwitch />}
              {showAuthButtons && !loading && isAuthenticated && (
                <>
                  <ProfileDropdown />
                </>
              )}
              <button
                className='hover:bg-muted/40 flex size-9 items-center justify-center rounded-lg'
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
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={cn(
          'bg-background/98 fixed inset-0 z-40 backdrop-blur-2xl xl:pointer-events-none xl:hidden',
          mobileOpen ? 'pointer-events-auto block' : 'pointer-events-none hidden'
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

          <div
            className='flex flex-col gap-3'
          >
            {showAuthButtons && (
              isAuthenticated ? (
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
              )
            )}
          </div>
        </div>
      </div>

      {/* Notification Dialog */}
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
