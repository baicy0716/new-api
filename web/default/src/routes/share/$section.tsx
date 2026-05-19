import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { CmsPage } from '@/features/cms'

export const Route = createFileRoute('/share/$section')({
  component: ShareSectionRoute,
})

function ShareSectionRoute() {
  const { section } = Route.useParams()
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, ''),
  })
  const currentPath = `/share/${section}`

  if (pathname !== currentPath) {
    return <Outlet />
  }

  return <CmsPage path={`/share/${section}`} />
}
