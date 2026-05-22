import { useMemo } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type TopNavLink } from '../types'

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: TopNavLink[]
}

const CONSOLE_ROUTE_PREFIXES = [
  '/dashboard',
  '/playground',
  '/chat',
  '/chat2link',
  '/keys',
  '/usage-logs',
  '/wallet',
  '/profile',
  '/channels',
  '/models',
  '/users',
  '/redemption-codes',
  '/subscriptions',
  '/system-settings',
]

function isLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'

  if (href === '/dashboard') {
    return CONSOLE_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * 顶部导航栏组件
 * 在大屏幕显示水平导航，在小屏幕显示下拉菜单
 */
export function TopNav({ className, links, ...props }: TopNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  // 规范化链接，确保所有可选属性都有默认值
  const normalizedLinks = useMemo(
    () =>
      links.map((link) => ({
        disabled: false,
        external: false,
        ...link,
        isActive:
          link.external || !link.href
            ? false
            : isLinkActive(pathname, link.href),
      })),
    [links, pathname]
  )

  return (
    <>
      {/* 移动端下拉菜单 */}
      <div className='sm:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline' className='size-7'>
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {normalizedLinks.map(
              ({ title, href, isActive, disabled, external, openInNewTab }) => (
                <DropdownMenuItem key={`${title}-${href}`} asChild>
                  {external ? (
                    <a
                      href={href}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noopener noreferrer' : undefined}
                      className={!isActive ? 'text-muted-foreground' : ''}
                    >
                      {title}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className={!isActive ? 'text-muted-foreground' : ''}
                      disabled={disabled}
                    >
                      {title}
                    </Link>
                  )}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 桌面端水平导航 */}
      <nav
        className={cn(
          'hidden min-w-0 items-center gap-3 overflow-x-auto sm:flex md:gap-4 lg:gap-5',
          className
        )}
        {...props}
      >
        {normalizedLinks.map(
          ({ title, href, isActive, disabled, external, openInNewTab }) =>
            external ? (
              <a
                key={`${title}-${href}`}
                href={href}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'hover:text-primary shrink-0 text-sm font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {title}
              </a>
            ) : (
              <Link
                key={`${title}-${href}`}
                to={href}
                disabled={disabled}
                className={cn(
                  'hover:text-primary shrink-0 text-sm font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {title}
              </Link>
            )
        )}
      </nav>
    </>
  )
}
