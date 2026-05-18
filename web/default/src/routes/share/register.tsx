import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/share/register')({
  beforeLoad: () => {
    throw redirect({
      to: '/sign-up',
    })
  },
})
