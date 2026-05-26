/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PublicLayout showMainContainer={false} showNotifications={false}>
      <div className='flex min-h-[calc(100svh-4rem)] flex-col'>
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
