import { PublicLayout } from '@/components/layout'

interface CmsBridgePageProps {
  title: string
  description: string
  src: string
}

export function CmsBridgePage(props: CmsBridgePageProps) {
  return (
    <PublicLayout showMainContainer={false}>
      <main className='min-h-screen overflow-hidden pt-20'>
        <section className='border-border/60 bg-background/85 mx-auto mb-4 flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 shadow-sm backdrop-blur md:px-6'>
          <div>
            <h1 className='text-base font-semibold tracking-tight'>
              {props.title}
            </h1>
            <p className='text-muted-foreground text-sm'>{props.description}</p>
          </div>
          <span className='text-muted-foreground text-xs'>Staging Closed Loop</span>
        </section>

        <div className='mx-auto max-w-7xl px-0 md:px-0'>
          <iframe
            src={props.src}
            title={props.title}
            className='bg-background min-h-[calc(100vh-8rem)] w-full border-0'
          />
        </div>
      </main>
    </PublicLayout>
  )
}
