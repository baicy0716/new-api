import { createFileRoute } from '@tanstack/react-router'
import { CmsPage } from '@/features/cms'

export const Route = createFileRoute('/share/$section')({
  component: ShareSectionRoute,
})

function ShareSectionRoute() {
  const { section } = Route.useParams()
  return <CmsPage path={`/share/${section}`} />
}
