import { Link } from '@tanstack/react-router'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationButton } from '@/components/notification-button'
import { NotificationDialog } from '@/components/notification-dialog'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Skeleton } from '@/components/ui/skeleton'
import { defaultTopNavLinks } from '../config/top-nav.config'
import { type TopNavLink } from '../types'
import { Header } from './header'
import { HeaderLogo } from './header-logo'
import { TopNav } from './top-nav'

/**
 * General application Header component
 * Integrates navigation bar, search, configuration and profile functions
 *
 * @example
 * // Basic usage
 * <AppHeader />
 *
 * @example
 * // Custom navigation links
 * <AppHeader navLinks={customLinks} />
 *
 * @example
 * // Hide navigation bar and search box
 * <AppHeader showTopNav={false} showSearch={false} />
 *
 * @example
 * // Fully customize left and right content
 * <AppHeader
 *   leftContent={<CustomLeft />}
 *   rightContent={<CustomRight />}
 * />
 */
type AppHeaderProps = {
  /**
   * Custom navigation links, uses default global navigation or dynamically generated from backend if not provided
   */
  navLinks?: TopNavLink[]
  /**
   * Whether to show top navigation bar
   * @default true
   */
  showTopNav?: boolean
  /**
   * Left content, overrides TopNav if provided
   */
  leftContent?: React.ReactNode
  /**
   * Whether to show search box
   * @default true
   */
  showSearch?: boolean
  /**
   * Custom right content, overrides default right content if provided
   */
  rightContent?: React.ReactNode
  /**
   * Whether to show notification button
   * @default true
   */
  showNotifications?: boolean
  /**
   * Whether to show config drawer
   * @default true
   */
  showConfigDrawer?: boolean
  /**
   * Whether to show profile dropdown
   * @default true
   */
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
  // Prioritize dynamically generated links from backend
  const dynamicLinks = useTopNavLinks()
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const { systemName, logo, loading, logoLoaded } = useSystemConfig()

  // Notifications hook
  const notifications = useNotifications()

  // Determine left content: custom content > navigation bar > null
  const leftSection =
    leftContent ||
    (showTopNav ? (
      <div className='flex min-w-0 flex-1 items-center gap-3 md:gap-4'>
        <Link
          to='/'
          className='hidden min-w-0 shrink-0 items-center gap-2 md:flex'
        >
          <div className='flex size-8 shrink-0 items-center justify-center rounded-xl border bg-muted/40'>
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

        <TopNav links={links} className='min-w-0 flex-1' />
      </div>
    ) : null)

  return (
    <>
      <Header>
        {leftSection}
        {rightContent ?? (
          <div className='ms-auto flex shrink-0 items-center space-x-4'>
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
