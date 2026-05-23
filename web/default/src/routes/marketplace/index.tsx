import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/marketplace/')({
  beforeLoad: () => {
    throw redirect({
      to: '/share/$section',
      params: { section: 'marketplace' },
    })
  },
})
