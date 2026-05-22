import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { getCmsPage } from './api'

interface CmsPageProps {
  path: string
}

function upsertMetaDescription(content: string) {
  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function scopeCmsStyles(styles: string) {
  return styles
    .replace(/(^|[\s,{])body::before/g, '$1.kg-cms-scope::before')
    .replace(/(^|[\s,{])body::after/g, '$1.kg-cms-scope::after')
    .replace(/(^|[\s,{])body(?![a-zA-Z0-9_-])/g, '$1.kg-cms-scope')
    .replace(/\.nav-brand-text(?![-\w])/g, '.kg-cms-scope .nav-brand-text')
    .replace(/\.nav-brand(?![-\w])/g, '.kg-cms-scope .nav-brand')
    .replace(/\.nav-links(?![-\w])/g, '.kg-cms-scope .nav-links')
    .replace(/\.nav-link(?![-\w])/g, '.kg-cms-scope .nav-link')
    .replace(/\.nav-cta(?![-\w])/g, '.kg-cms-scope .nav-cta')
    .replace(/\.nav-btn(?![-\w])/g, '.kg-cms-scope .nav-btn')
    .replace(/\.nav-user-auth(?![-\w])/g, '.kg-cms-scope .nav-user-auth')
    .replace(/\.nav-user-anon(?![-\w])/g, '.kg-cms-scope .nav-user-anon')
    .replace(/\.nav-user-name(?![-\w])/g, '.kg-cms-scope .nav-user-name')
    .replace(/\.nav-indicator(?![-\w])/g, '.kg-cms-scope .nav-indicator')
    .replace(/\.nav-item(?![-\w])/g, '.kg-cms-scope .nav-item')
    .replace(/\.nav-dropdown(?![-\w])/g, '.kg-cms-scope .nav-dropdown')
}

function enhanceCmsHtml(html: string, path: string) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const isHomePage = path === '/share/' || path === '/share'

  if (isHomePage) {
    const poweredByMarkup = `
      <section class="kg-home-powered" aria-label="Powered by providers">
        <div class="kg-home-powered-label">Powered by</div>
        <div class="kg-home-powered-row">
          <span>OpenAI</span>
          <span>Anthropic</span>
          <span>Google Gemini</span>
          <span>Qwen</span>
          <span>Moonshot</span>
        </div>
      </section>
    `
    const existingPoweredBy = doc.querySelector('.home-logos, .kg-home-powered')
    const promoWrap = doc.querySelector('.home-promo-wrap')

    if (existingPoweredBy) {
      existingPoweredBy.outerHTML = poweredByMarkup
    } else if (promoWrap) {
      promoWrap.insertAdjacentHTML('afterend', poweredByMarkup)
    }
  }

  if (!isHomePage) {
    const hero = doc.querySelector('.page-hero-band, .hero')
    const divider = doc.querySelector('.page-hero-divider')

    if (hero && !divider) {
      hero.insertAdjacentHTML('afterend', '<div class="page-hero-divider"></div>')
    }
  }

  return doc.body.innerHTML
}

function getCmsOverrideStyles(path: string) {
  const isHomePage = path === '/share/' || path === '/share'

  if (isHomePage) {
    return `
      .kg-cms-home .home-hero {
        padding-top: clamp(96px, 14vh, 156px) !important;
        padding-bottom: clamp(52px, 7vw, 88px) !important;
      }

      .kg-cms-home .home-hero::before {
        left: 50% !important;
        top: 6% !important;
        width: min(1040px, 84vw) !important;
        height: min(1040px, 84vw) !important;
        background:
          radial-gradient(
            circle at center,
            rgba(59, 130, 246, 0.24) 0%,
            rgba(99, 102, 241, 0.16) 28%,
            rgba(245, 158, 11, 0.1) 52%,
            rgba(255, 255, 255, 0) 74%
          ) !important;
        filter: blur(70px) !important;
        opacity: 1 !important;
      }

      .kg-cms-home .home-hero::after {
        width: min(820px, 72vw) !important;
        height: min(820px, 72vw) !important;
        border: 1px solid rgba(37, 99, 235, 0.12) !important;
        box-shadow:
          0 0 0 96px rgba(255, 255, 255, 0),
          0 0 0 97px rgba(37, 99, 235, 0.08),
          0 0 0 226px rgba(255, 255, 255, 0),
          0 0 0 227px rgba(245, 158, 11, 0.06) !important;
        opacity: 1 !important;
      }

      .kg-cms-home .home-hero-marquee {
        margin-top: 46px !important;
      }

      .kg-cms-home .home-promo-wrap {
        padding-top: 10px !important;
        padding-bottom: 18px !important;
      }

      .kg-cms-home .home-promo {
        box-shadow:
          0 18px 38px -28px rgba(139, 92, 246, 0.28),
          0 8px 24px -20px rgba(15, 23, 42, 0.16) !important;
      }

      .kg-cms-home .kg-home-powered {
        max-width: 1120px;
        margin: 0 auto clamp(28px, 4vw, 44px) !important;
        padding: 0 var(--kg-px);
        text-align: center;
      }

      .kg-cms-home .kg-home-powered-label {
        margin-bottom: 16px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        letter-spacing: 0.22em !important;
        color: rgba(15, 23, 42, 0.48) !important;
        text-transform: uppercase;
      }

      .kg-cms-home .kg-home-powered-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: clamp(18px, 3vw, 34px) !important;
      }

      .kg-cms-home .kg-home-powered-row span {
        font-size: clamp(17px, 1.5vw, 20px) !important;
        font-weight: 600 !important;
        color: rgba(15, 23, 42, 0.76) !important;
      }

      .kg-cms-home .home-stats {
        margin-top: 0 !important;
      }

      .kg-cms-home .home-section {
        padding-top: clamp(54px, 6vw, 84px) !important;
      }

      .kg-cms-home .home-section-head {
        margin-bottom: clamp(28px, 4vw, 44px) !important;
      }

      .kg-cms-home .home-section-eyebrow {
        color: rgba(71, 85, 105, 0.9) !important;
      }

      :is(.dark, [data-theme='dark']) .kg-cms-home .home-hero::before {
        background:
          radial-gradient(
            circle at center,
            rgba(96, 165, 250, 0.34) 0%,
            rgba(129, 140, 248, 0.24) 28%,
            rgba(251, 191, 36, 0.12) 54%,
            rgba(0, 0, 0, 0) 76%
          ) !important;
        filter: blur(82px) !important;
      }

      :is(.dark, [data-theme='dark']) .kg-cms-home .home-hero::after {
        border-color: rgba(148, 163, 184, 0.28) !important;
        box-shadow:
          0 0 0 96px rgba(255, 255, 255, 0),
          0 0 0 97px rgba(96, 165, 250, 0.14),
          0 0 0 226px rgba(255, 255, 255, 0),
          0 0 0 227px rgba(251, 191, 36, 0.08) !important;
      }

      :is(.dark, [data-theme='dark']) .kg-cms-home .home-promo {
        box-shadow:
          0 22px 44px -32px rgba(139, 92, 246, 0.36),
          0 14px 28px -24px rgba(2, 6, 23, 0.56) !important;
      }

      :is(.dark, [data-theme='dark']) .kg-cms-home .kg-home-powered-label {
        color: rgba(226, 232, 240, 0.58) !important;
      }

      :is(.dark, [data-theme='dark']) .kg-cms-home .kg-home-powered-row span {
        color: rgba(226, 232, 240, 0.86) !important;
      }

      :is(.dark, [data-theme='dark']) .kg-cms-home .home-section-eyebrow {
        color: rgba(148, 163, 184, 0.9) !important;
      }
    `
  }

  return ''
}

function loadExternalScript(src: string, type?: string) {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-kuaigou-cms-src="${CSS.escape(src)}"]`
    )
    if (existing) {
      resolve(existing)
      return
    }

    const scriptEl = document.createElement('script')
    scriptEl.src = src
    scriptEl.async = false
    if (type) {
      scriptEl.type = type
    }
    scriptEl.setAttribute('data-kuaigou-cms-src', src)
    scriptEl.onload = () => resolve(scriptEl)
    scriptEl.onerror = () => reject(new Error(`Failed to load CMS script: ${src}`))
    document.body.appendChild(scriptEl)
  })
}

export function CmsPage({ path }: CmsPageProps) {
  const { t } = useTranslation()
  const isHomePage = path === '/share/' || path === '/share'
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cms-page', path],
    queryFn: () => getCmsPage(path),
    staleTime: 5_000,
  })
  const enhancedHtml = data ? enhanceCmsHtml(data.html, path) : ''

  useEffect(() => {
    if (!data) return

    const previousTitle = document.title
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute('content') ??
      ''

    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-kuaigou-cms', path)
    styleEl.textContent = scopeCmsStyles(data.styles)
    document.head.appendChild(styleEl)

    const overrideStyleEl = document.createElement('style')
    overrideStyleEl.setAttribute('data-kuaigou-cms-override', path)
    overrideStyleEl.textContent = getCmsOverrideStyles(path)
    if (overrideStyleEl.textContent) {
      document.head.appendChild(overrideStyleEl)
    }

    const linkEls = data.stylesheets.map((href) => {
      const linkEl = document.createElement('link')
      linkEl.rel = 'stylesheet'
      linkEl.href = href
      linkEl.setAttribute('data-kuaigou-cms', path)
      document.head.appendChild(linkEl)
      return linkEl
    })
    const scriptEls: HTMLScriptElement[] = []
    let cancelled = false

    const bootCmsScripts = async () => {
      const scripts = data.scripts ?? []
      const inlineScripts = scripts.filter((script) => !script.src && script.content)
      const externalScripts = scripts.filter((script) => script.src)
      const hadAlpine = Boolean(
        (window as typeof window & { Alpine?: unknown }).Alpine
      )

      inlineScripts.forEach((script) => {
        if (cancelled || !script.content) return
        const scriptEl = document.createElement('script')
        if (script.type) {
          scriptEl.type = script.type
        }
        scriptEl.text = script.content
        scriptEl.setAttribute('data-kuaigou-cms', path)
        document.body.appendChild(scriptEl)
        scriptEls.push(scriptEl)
      })

      for (const script of externalScripts) {
        if (cancelled || !script.src) continue
        const scriptEl = await loadExternalScript(script.src, script.type)
        scriptEl.setAttribute('data-kuaigou-cms', path)
        scriptEls.push(scriptEl)
      }

      const alpine = (
        window as typeof window & {
          Alpine?: { initTree?: (el: Element) => void }
        }
      ).Alpine
      const main = document.querySelector('.kg-cms-scope')
      if (!cancelled && hadAlpine && alpine?.initTree && main) {
        alpine.initTree(main)
      }
    }

    void bootCmsScripts().catch((error) => {
      console.error('Failed to bootstrap CMS scripts', error)
    })

    if (data.title) {
      document.title = data.title
    }
    if (data.description) {
      upsertMetaDescription(data.description)
    }

    return () => {
      cancelled = true
      document.title = previousTitle
      upsertMetaDescription(previousDescription)
      styleEl.remove()
      overrideStyleEl.remove()
      linkEls.forEach((linkEl) => linkEl.remove())
      scriptEls.forEach((scriptEl) => {
        if (!scriptEl.src || !scriptEl.dataset.kuaigouCmsSrc) {
          scriptEl.remove()
        }
      })
    }
  }, [data, path])

  if (isLoading) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='flex min-h-screen items-center justify-center pt-20'>
          <div className='text-muted-foreground'>{t('Loading...')}</div>
        </main>
      </PublicLayout>
    )
  }

  if (isError || !data) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='flex min-h-screen items-center justify-center px-6 pt-20'>
          <div className='max-w-xl text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              {t('页面加载失败')}
            </h1>
            <p className='text-muted-foreground mt-3 text-sm'>
              {t('CMS 内容暂时不可用，请稍后再试。')}
            </p>
          </div>
        </main>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <>
        <main
          className={
            isHomePage
              ? 'kg-cms-scope kg-cms-home min-h-screen'
              : `kg-cms-scope kg-cms-page min-h-screen ${
                  path.startsWith('/share/playground') ? 'kg-cms-playground' : ''
                }`
          }
          dangerouslySetInnerHTML={{ __html: enhancedHtml }}
        />
        {data.footerHtml ? (
          <div dangerouslySetInnerHTML={{ __html: data.footerHtml }} />
        ) : (
          <Footer />
        )}
      </>
    </PublicLayout>
  )
}
