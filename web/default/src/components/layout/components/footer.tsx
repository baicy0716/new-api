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
import { Fragment, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useStatus } from '@/hooks/use-status'
import { getCmsPage } from '@/features/cms/api'

interface FooterLink {
  text: string
  href: string
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: string
  name?: string
  columns?: FooterColumnProps[]
  copyright?: string
  className?: string
  /** mini = 单行紧凑（用于 auth / 短表单页，避免抢占注意力）；
   *  默认 = 完整多列（用于 marketing / CMS / dashboard）。 */
  variant?: 'default' | 'mini'
}

function FooterLinkItem(props: { link: FooterLink }) {
  const { t } = useTranslation()
  const isExternal = props.link.href.startsWith('http')
  const label = t(props.link.text)

  if (isExternal) {
    return (
      <a
        href={props.link.href}
        target='_blank'
        rel='noopener noreferrer'
        className='text-muted-foreground hover:text-foreground text-sm transition-colors duration-200'
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={props.link.href}
      className='text-muted-foreground hover:text-foreground text-sm transition-colors duration-200'
    >
      {label}
    </Link>
  )
}

// Renders User Agreement / Privacy Policy links inline with the parent's
// copyright row when either is configured in System Settings → Site. Emits
// fragmented siblings so the parent flex container's gap controls spacing.
function LegalLinks(props: { leadingSeparator?: boolean }) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const items: { key: string; label: string; href: string }[] = []
  if (status?.user_agreement_enabled) {
    items.push({
      key: 'user-agreement',
      label: t('User Agreement'),
      href: '/user-agreement',
    })
  }
  if (status?.privacy_policy_enabled) {
    items.push({
      key: 'privacy-policy',
      label: t('Privacy Policy'),
      href: '/privacy-policy',
    })
  }
  if (items.length === 0) {
    return null
  }
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {(props.leadingSeparator || index > 0) && (
            <span aria-hidden='true' className='text-muted-foreground/30'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='hover:text-foreground transition-colors duration-200'
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </>
  )
}

// inline=true returns just the inner span for composition in a parent flex
// row. inline=false wraps in a centered/right-aligned div (default).
// 紧凑版："Powered by New API" — 不重复 © 年份/版权，AGPL 上游归属链接
// 仍然可见（仅去掉冗余的双版权行）。
function ProjectAttribution(props: { inline?: boolean }) {
  const { t } = useTranslation()
  const content = (
    <span className='text-muted-foreground/45'>
      {t('Powered by')}{' '}
      <a
        href='https://github.com/QuantumNous/new-api'
        target='_blank'
        rel='noopener noreferrer'
        className='hover:text-foreground/70 underline-offset-2 transition-colors hover:underline'
      >
        {t('New API')}
      </a>
    </span>
  )
  if (props.inline) {
    return content
  }
  return (
    <div className='text-muted-foreground/45 text-center text-xs sm:text-right'>
      {content}
    </div>
  )
}

// ── CSS for CMS-driven footer ────────────────────────────────────────────────
// 跟 smart-router cms_layout.html 的 .footer* 样式对齐，scoped 在 wrapper 内
// 防止泄漏到 React layout 其他地方。颜色直接用 CMS 实际值（不依赖外部 var
// 是否定义），dark mode 用 .dark / [data-theme="dark"] 双 selector 同时覆盖
// staging React 壳和生产 smart-router。
const CMS_FOOTER_STYLES = `
.kg-cms-footer-host .footer {
  margin-top: 0;
  padding: 32px 24px 24px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  color: #6B7280;
  font-size: 13px;
  background: transparent;
}
.kg-cms-footer-host .footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 16px;
}
.kg-cms-footer-host .footer-links a {
  color: #4B5563;
  margin-right: 22px; font-size: 13px;
  text-decoration: none;
  transition: color 0.15s ease;
}
.kg-cms-footer-host .footer-links a:hover { color: #0A0F1F; }
.kg-cms-footer-host .footer-copy {
  font-size: 12.5px;
  color: #9CA3AF;
  letter-spacing: -0.005em;
}
.kg-cms-footer-host .footer-copy .kg-em {
  font-style: italic; font-weight: 500;
  color: #6B7280;
}
@media (max-width: 600px) {
  .kg-cms-footer-host .footer-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
  .kg-cms-footer-host .footer-links a { margin-right: 14px; }
}
:is(.dark, [data-theme="dark"]) .kg-cms-footer-host .footer {
  border-top-color: rgba(255, 255, 255, 0.10);
  color: #94A3B8;
}
:is(.dark, [data-theme="dark"]) .kg-cms-footer-host .footer-links a { color: #CBD5E1; }
:is(.dark, [data-theme="dark"]) .kg-cms-footer-host .footer-links a:hover { color: #F1F5F9; }
:is(.dark, [data-theme="dark"]) .kg-cms-footer-host .footer-copy { color: #64748B; }
:is(.dark, [data-theme="dark"]) .kg-cms-footer-host .footer-copy .kg-em { color: #94A3B8; }
`

// 全站共享一份 CMS footer fetch（react-query 自带去重 + 缓存）
// staleTime 30 分钟：footer 变化频率低，admin 改了 fragment 后下次 SPA 路由
// 切换或 30min 后自动刷新。
function useCmsFooter() {
  return useQuery({
    queryKey: ['cms-site-footer'],
    queryFn: () => getCmsPage('/share/'),
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    retry: 1,
  })
}

export function Footer(props: FooterProps) {
  const { t } = useTranslation()
  const {
    systemName,
    logo: systemLogo,
    footerHtml,
    demoSiteEnabled,
  } = useSystemConfig()

  const displayLogo = systemLogo || props.logo || '/logo.png'
  const displayName = systemName || props.name || 'New API'
  const isDemoSiteMode = Boolean(demoSiteEnabled)
  const currentYear = new Date().getFullYear()

  // ── Primary：从 CMS 取 footer HTML（route admin fragments 可编辑）──
  // 任何用 <Footer /> 的页面（auth / console / cms-page fallback）都拿同一份
  // CMS footer，全站视觉统一。fetch 失败或加载中走下面的 React fallback。
  const { data: cmsData } = useCmsFooter()
  if (cmsData?.footerHtml && props.variant !== 'mini') {
    return (
      <div className='kg-cms-footer-host'>
        <style dangerouslySetInnerHTML={{ __html: CMS_FOOTER_STYLES }} />
        <div dangerouslySetInnerHTML={{ __html: cmsData.footerHtml }} />
      </div>
    )
  }

  // ── Mini variant：用于 auth / 短表单页。单行布局，不堆叠 brand block。──
  // 用户在登录注册页核心任务是填表，footer 应该最低存在感但仍有品牌信息。
  if (props.variant === 'mini') {
    return (
      <footer
        className={cn(
          'border-border/40 relative z-10 border-t',
          props.className
        )}
      >
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted-foreground/50 sm:flex-row'>
          <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start'>
            <span className='font-medium text-muted-foreground/70'>{displayName}</span>
            <span aria-hidden='true' className='text-muted-foreground/30'>·</span>
            <span>{t('Powerful API Management Platform')}</span>
            <span aria-hidden='true' className='text-muted-foreground/30'>·</span>
            <span>&copy; {currentYear}</span>
          </div>
          <ProjectAttribution />
        </div>
      </footer>
    )
  }

  const fallbackColumns = useMemo<FooterColumnProps[]>(
    () => [
      {
        title: t('footer.columns.about.title'),
        links: [
          {
            text: t('footer.columns.about.links.aboutProject'),
            href: 'https://docs.newapi.pro/wiki/project-introduction/',
          },
          {
            text: t('footer.columns.about.links.contact'),
            href: 'https://docs.newapi.pro/support/community-interaction/',
          },
          {
            text: t('footer.columns.about.links.features'),
            href: 'https://docs.newapi.pro/wiki/features-introduction/',
          },
        ],
      },
      {
        title: t('footer.columns.docs.title'),
        links: [
          {
            text: t('footer.columns.docs.links.quickStart'),
            href: 'https://docs.newapi.pro/getting-started/',
          },
          {
            text: t('footer.columns.docs.links.installation'),
            href: 'https://docs.newapi.pro/installation/',
          },
          {
            text: t('footer.columns.docs.links.apiDocs'),
            href: 'https://docs.newapi.pro/api/',
          },
        ],
      },
      {
        title: t('footer.columns.related.title'),
        links: [
          {
            text: t('footer.columns.related.links.oneApi'),
            href: 'https://github.com/songquanpeng/one-api',
          },
          {
            text: t('footer.columns.related.links.midjourney'),
            href: 'https://github.com/novicezk/midjourney-proxy',
          },
          {
            text: t('footer.columns.related.links.newApiKeyTool'),
            href: 'https://github.com/Calcium-Ion/new-api-key-tool',
          },
        ],
      },
    ],
    [t]
  )

  const displayColumns = props.columns ?? fallbackColumns

  if (footerHtml) {
    return (
      <footer
        className={cn(
          'border-border/40 relative z-10 border-t',
          props.className
        )}
      >
        <div className='mx-auto w-full max-w-6xl px-6 py-5'>
          <div className='bg-muted/20 border-border/50 flex flex-col items-center justify-between gap-4 rounded-2xl border px-4 py-4 backdrop-blur-sm sm:flex-row sm:px-5'>
            <div
              className='custom-footer text-muted-foreground min-w-0 text-center text-sm sm:text-left'
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />
            <div className='border-border/60 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t pt-4 text-muted-foreground/45 text-xs sm:w-auto sm:justify-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5'>
              <LegalLinks />
              <ProjectAttribution inline />
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn('border-border/40 relative z-10 border-t', props.className)}
    >
      <div className='mx-auto max-w-6xl px-6 py-12 md:py-16'>
        <div className='flex flex-col justify-between gap-10 md:flex-row md:gap-16'>
          {/* Brand column */}
          <div className='shrink-0'>
            <Link to='/' className='group flex items-center gap-2.5'>
              <img
                src={displayLogo}
                alt={displayName}
                className='size-7 rounded-lg object-contain'
              />
              <span className='text-sm font-semibold tracking-tight'>
                {displayName}
              </span>
            </Link>
            <p className='text-muted-foreground/60 mt-3 max-w-[200px] text-xs leading-relaxed'>
              {t('Powerful API Management Platform')}
            </p>
          </div>

          {/* Links columns */}
          {isDemoSiteMode && (
            <div className='grid grid-cols-3 gap-8 md:gap-16'>
              {displayColumns.map((column, index) => (
                <div key={index}>
                  <p className='text-muted-foreground/50 mb-3 text-xs font-medium tracking-wider uppercase'>
                    {t(column.title)}
                  </p>
                  <ul className='space-y-2.5'>
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <FooterLinkItem link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copyright + optional legal links inline on the left, project
            attribution on the right; wraps on narrow screens. */}
        <div className='border-border/30 mt-12 flex flex-col items-center justify-between gap-x-3 gap-y-2 border-t pt-6 sm:flex-row'>
          <div className='text-muted-foreground/40 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:justify-start'>
            <span>
              &copy; {currentYear} {displayName}.{' '}
              {props.copyright ?? t('footer.defaultCopyright')}
            </span>
            <LegalLinks leadingSeparator />
          </div>
          <ProjectAttribution />
        </div>
      </div>
    </footer>
  )
}
