import { createFileRoute } from '@tanstack/react-router'
import { CmsBridgePage } from '@/features/cms-bridge/cms-bridge-page'

function ShareCenterPage() {
  return (
    <CmsBridgePage
      title='快狗分享'
      description='当前在 staging 壳内承接 CMS 内容，不会跳出到生产域名。'
      src='https://api.kuaigouai.com/share/share'
    />
  )
}

export const Route = createFileRoute('/share-center/')({
  component: ShareCenterPage,
})
