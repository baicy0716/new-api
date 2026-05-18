export interface CmsPagePayload {
  path: string
  title: string
  description: string
  html: string
  footerHtml: string
  styles: string
  stylesheets: string[]
}

export interface CmsPageResponse {
  success: boolean
  message?: string
  data: CmsPagePayload
}
