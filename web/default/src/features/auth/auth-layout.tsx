import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PublicLayout showMainContainer={false} showNotifications={false}>
      <div className='flex min-h-svh flex-col pt-20 md:pt-24'>
        <main className='flex flex-1 items-center px-4 py-8 md:px-6 md:py-12'>
          <div className='mx-auto w-full max-w-7xl'>
            <div className='mx-auto w-full max-w-[480px]'>
              <section className='bg-background/92 border-border/60 rounded-2xl border px-5 py-6 shadow-sm backdrop-blur-sm sm:px-8 sm:py-8'>
                {children}
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PublicLayout>
  )
}
