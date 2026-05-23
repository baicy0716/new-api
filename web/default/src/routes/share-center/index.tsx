import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/share-center/')({
  beforeLoad: () => {
    throw redirect({ to: '/share/$section', params: { section: 'share' } })
  },
})
