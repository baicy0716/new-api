import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/share/console')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})
