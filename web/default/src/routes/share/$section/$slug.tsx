import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { CmsPage } from '@/features/cms'

export const Route = createFileRoute('/share/$section/$slug')({
  component: ShareSectionSlugRoute,
})

function ShareSectionSlugRoute() {
  const { section, slug } = Route.useParams()
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, ''),
  })
  const currentPath = `/share/${section}/${slug}`

  if (pathname !== currentPath) {
    return <Outlet />
  }

  return <CmsPage path={`/share/${section}/${slug}`} />
}
