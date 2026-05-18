import { api } from '@/lib/api'
import type { CmsPageResponse } from './types'

export async function getCmsPage(pagePath: string) {
  const res = await api.get<CmsPageResponse>('/api/cms/page', {
    params: { path: pagePath },
  })
  return res.data.data
}
