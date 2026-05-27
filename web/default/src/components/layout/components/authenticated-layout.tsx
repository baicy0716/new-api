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
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AnimatedOutlet } from '@/components/page-transition'
import { SkipToMain } from '@/components/skip-to-main'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  // fork 历来的布局：sidebar 左侧（占满高度，logo 在最上）+ 右侧上下分（header
  // 在上、content 在下）。这样 sidebar-top-logo 跟 header-nav 天然水平同排。
  // upstream rc.10 改成了「header 全宽顶部 + sidebar 在 header 下面」，
  // 在 sidebar logo 已经放回的前提下会跟 header nav 不在一行；改回。
  return (
    <LayoutProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <div className='flex min-h-svh w-full'>
            <AppSidebar />
            <div className='flex min-w-0 flex-1 flex-col [--app-header-height:4.5rem]'>
              <AppHeader />
              <SidebarInset
                className={cn(
                  '@container/content',
                  'h-[calc(100svh-var(--app-header-height,0px))]',
                  'min-h-0 overflow-hidden',
                  'peer-data-[variant=inset]:h-[calc(100svh-var(--app-header-height,0px)-(var(--spacing)*4))]'
                )}
              >
                {props.children ?? <AnimatedOutlet />}
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </SearchProvider>
    </LayoutProvider>
  )
}
