export interface CmsPagePayload {
  path: string
  title: string
  description: string
  html: string
  footerHtml: string
  styles: string
  stylesheets: string[]
  scripts?: CmsScriptPayload[]
}

export interface CmsScriptPayload {
  src?: string
  content?: string
  type?: string
  async?: boolean
  defer?: boolean
}

export interface CmsPageResponse {
  success: boolean
  message?: string
  data: CmsPagePayload
}
