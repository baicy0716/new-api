import { createFileRoute } from '@tanstack/react-router'
import { CmsPage } from '@/features/cms'

export const Route = createFileRoute('/share/$section/$slug/$child')({
  component: ShareSectionSlugChildRoute,
})

function ShareSectionSlugChildRoute() {
  const { section, slug, child } = Route.useParams()
  return <CmsPage path={`/share/${section}/${slug}/${child}`} />
}
