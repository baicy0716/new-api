import { createFileRoute } from '@tanstack/react-router'
import { CmsBridgePage } from '@/features/cms-bridge/cms-bridge-page'

function MarketplacePage() {
  return (
    <CmsBridgePage
      title='工具集市'
      description='当前在 staging 壳内承接 CMS 内容，不会跳出到生产域名。'
      src='https://api.kuaigouai.com/share/marketplace'
    />
  )
}

export const Route = createFileRoute('/marketplace/')({
  component: MarketplacePage,
})
