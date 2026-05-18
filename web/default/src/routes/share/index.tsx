import { createFileRoute } from '@tanstack/react-router'
import { CmsPage } from '@/features/cms'

export const Route = createFileRoute('/share/')({
  component: () => <CmsPage path='/share/' />,
})
