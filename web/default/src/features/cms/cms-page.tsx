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

export function CmsPage({ path }: CmsPageProps) {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cms-page', path],
    queryFn: () => getCmsPage(path),
    staleTime: 5_000,
  })

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

    const linkEls = data.stylesheets.map((href) => {
      const linkEl = document.createElement('link')
      linkEl.rel = 'stylesheet'
      linkEl.href = href
      linkEl.setAttribute('data-kuaigou-cms', path)
      document.head.appendChild(linkEl)
      return linkEl
    })

    if (data.title) {
      document.title = data.title
    }
    if (data.description) {
      upsertMetaDescription(data.description)
    }

    return () => {
      document.title = previousTitle
      upsertMetaDescription(previousDescription)
      styleEl.remove()
      linkEls.forEach((linkEl) => linkEl.remove())
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
          className='kg-cms-scope min-h-screen pt-24 md:pt-28'
          dangerouslySetInnerHTML={{ __html: data.html }}
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
