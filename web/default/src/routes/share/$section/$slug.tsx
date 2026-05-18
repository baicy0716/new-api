import { createFileRoute } from '@tanstack/react-router'
import { CmsPage } from '@/features/cms'

export const Route = createFileRoute('/share/$section/$slug')({
  component: ShareSectionSlugRoute,
})

function ShareSectionSlugRoute() {
  const { section, slug } = Route.useParams()
  return <CmsPage path={`/share/${section}/${slug}`} />
}
