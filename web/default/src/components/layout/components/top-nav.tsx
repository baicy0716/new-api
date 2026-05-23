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
  variant?: 'plain' | 'pill'
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

export function TopNav({
  className,
  links,
  variant = 'plain',
  ...props
}: TopNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

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
      <div className='sm:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <Button
                size='icon'
                variant='outline'
                className={cn(
                  'size-7',
                  variant === 'pill' &&
                    'border-border/70 bg-background/80 rounded-full shadow-sm backdrop-blur'
                )}
              />
            }
          >
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {normalizedLinks.map(
              ({ title, href, isActive, disabled, external, openInNewTab }) => (
                <DropdownMenuItem
                  key={`${title}-${href}`}
                  render={
                    external ? (
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
                    )
                  }
                ></DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden min-w-0 items-center overflow-x-auto sm:flex',
          variant === 'pill'
            ? 'bg-background/78 border-border/70 rounded-full border px-2 py-1 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.38)] backdrop-blur-xl'
            : 'gap-3 md:gap-4 lg:gap-5',
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
                  'shrink-0 text-sm font-medium transition-colors',
                  variant === 'pill'
                    ? 'hover:bg-foreground/[0.06] rounded-full px-3 py-1.5'
                    : 'hover:text-primary',
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
                  'shrink-0 text-sm font-medium transition-colors',
                  variant === 'pill'
                    ? 'hover:bg-foreground/[0.06] rounded-full px-3 py-1.5'
                    : 'hover:text-primary',
                  variant === 'pill' &&
                    isActive &&
                    'bg-foreground/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]',
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
