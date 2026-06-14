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
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MOTION_TRANSITION, MOTION_VARIANTS } from '@/lib/motion'
import { useLayout } from '@/context/layout-provider'
import { useSidebarView } from '@/hooks/use-sidebar-view'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { SidebarViewHeader } from './sidebar-view-header'

const KG_LOGO_URL = 'https://i.imgur.com/7Tkqn1t.png'

/** Sidebar 顶部紧凑品牌：text-sm + size-8 logo，跟 nav 视觉同等权重，
 *  天然跟 nav 文字 baseline 居中对齐。不复用 SystemBrand 是因为它
 *  套了 SidebarMenuButton size=lg + h-auto + py-2 + size-11 image，
 *  实际撑出 ~60px 高度的图块，在 4.5rem header 里视觉偏上一截。 */
function SidebarTopBrand() {
  return (
    <Link
      to='/'
      className='flex h-full items-center gap-2 text-foreground transition-colors hover:opacity-90'
      aria-label='KuaiGouAI · 首页'
    >
      <img
        src={KG_LOGO_URL}
        alt='KuaiGouAI'
        className='size-8 shrink-0 rounded-lg object-contain'
      />
      <span className='text-[15px] font-semibold tracking-tight leading-none'>
        KuaiGou<span className='ml-px font-serif text-[0.95em] italic text-blue-500 dark:text-blue-300'>AI</span>
      </span>
    </Link>
  )
}

/**
 * Application sidebar.
 *
 * Adopts the Vercel / Cloudflare "drill-in" pattern: the URL drives
 * which sidebar *view* is rendered. Clicking a top-level entry like
 * `System Settings` swaps the sidebar to a contextual workspace —
 * with a `← Back to Dashboard` affordance — instead of stacking the
 * sub-navigation inside the root tree.
 *
 * Architecture:
 *   - View resolution + filtering: {@link useSidebarView}
 *   - View registry: `layout/lib/sidebar-view-registry.ts`
 *   - Per-view header: {@link SidebarViewHeader}
 *
 * Adding a new nested view only requires registering a {@link SidebarView}
 * in the registry; this component requires no changes.
 */
export function AppSidebar() {
  const { collapsible } = useLayout()
  const { key, view, navGroups } = useSidebarView()
  const shouldReduce = useReducedMotion()

  // 重置 --app-header-height 为 0：theme.css 全局设了 3rem，导致 sidebar
  // 内部 'fixed top-[var(--app-header-height)]' 把整个 sidebar 推下 48px，
  // SystemBrand 跟 header nav 不在一条 Y 上。fork 原来 HEAD 就有这个设置，
  // 合 upstream 时丢了。
  //
  // 强制 variant='sidebar'（不用 useLayout 的 'inset' 默认）：inset 会给
  // sidebar 容器加 p-2 内边距，把内容下推 8px → sidebar header border 比
  // app header border 低 8px。强制 sidebar variant 让 sidebar 顶到 y=0，
  // 两个 header 的 border 严格在同一条 Y。
  return (
    <Sidebar
      collapsible={collapsible}
      variant='sidebar'
      className='[--app-header-height:0px]'
    >
      {view ? (
        <SidebarViewHeader view={view} />
      ) : (
        /* Root view：紧凑 brand 头，h-[4.5rem] 跟 AppHeader 同高 + border-b
           跟 header bottom 连一条横线。 p-0 消掉 SidebarHeader 默认的 p-2，
           内部 Link 用 h-full + items-center 让品牌严格居中在 72px 容器。 */
        <SidebarHeader className='border-sidebar-border h-[4.5rem] border-b p-0 px-4'>
          <SidebarTopBrand />
        </SidebarHeader>
      )}

      <SidebarContent className='py-2'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={key}
            initial={
              shouldReduce ? false : MOTION_VARIANTS.sidebarSlide.initial
            }
            animate={MOTION_VARIANTS.sidebarSlide.animate}
            exit={shouldReduce ? undefined : MOTION_VARIANTS.sidebarSlide.exit}
            transition={MOTION_TRANSITION.fast}
            className='flex flex-col'
          >
            {navGroups.map((props) => (
              <NavGroup key={props.id || props.title} {...props} />
            ))}
          </motion.div>
        </AnimatePresence>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
