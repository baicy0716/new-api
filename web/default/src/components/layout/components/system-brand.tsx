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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const CMS_BRAND_LOGO_URL = 'https://i.imgur.com/7Tkqn1t.png'

type SystemBrandProps = {
  defaultName?: string
  defaultVersion?: string
  variant?: 'sidebar' | 'inline'
}

export function SystemBrand(props: SystemBrandProps) {
  const { t } = useTranslation()
  const variant = props.variant ?? 'sidebar'
  const name = props.defaultName || 'KuaiGouAI'

  if (variant === 'inline') {
    return (
      <Link
        to='/share'
        aria-label={t('Go to home')}
        className={cn(
          'text-foreground inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 text-sm font-medium transition-colors outline-none select-none',
          'hover:bg-accent focus-visible:ring-ring/40 focus-visible:ring-2'
        )}
      >
        <div className='flex size-5 items-center justify-center overflow-hidden rounded-md'>
          <img
            src={CMS_BRAND_LOGO_URL}
            alt={t('Logo')}
            className='size-full rounded-md object-cover'
          />
        </div>
        <span className='max-w-[12rem] truncate'>{name}</span>
      </Link>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='hover:text-sidebar-foreground active:text-sidebar-foreground h-auto cursor-default rounded-2xl px-2 py-2 hover:bg-transparent active:bg-transparent'
          render={<Link to='/share' />}
        >
          <div className='flex aspect-square size-11 items-center justify-center overflow-hidden rounded-2xl'>
            <img
              src={CMS_BRAND_LOGO_URL}
              alt='KuaiGouAI'
              className='h-9 w-auto object-contain drop-shadow-[0_10px_16px_rgba(37,99,235,0.2)]'
            />
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='truncate text-[1.02rem] font-semibold tracking-tight'>
              KuaiGou
              <span className='ml-px font-serif text-[0.98em] text-blue-500 italic dark:text-blue-300'>
                AI
              </span>
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
