/*
浮动客服按钮 — 跳转主站首页并自动弹出工单框（/share/?support=1）

为什么不在 staging 内嵌完整工单 widget：
- 主站工单系统在 smart-router（独立服务），有自己的 /api/tickets/*
- staging 用 NewAPI 后端，没有这些接口
- 跨域调主站需要 CORS + cookie SameSite=None 配置，复杂且 staging 用户体系不通
- 测试环境的工单本来就应该走主站统一处理 → 跳转最稳

工单框：smart-router cms_layout 的 #kg-tk-fab 模态框。带 ?support=1 落地即自动弹出
（ticket-widget.js 检测 ?support=1 / #support 调 openModal）。
之前误指向 /share/services（海外代理服务文章，不是工单页）。

样式 mirror 主站 #kg-tk-fab（cms_layout.html）。
*/

export function FloatingSupportButton() {
  // 同源相对 URL：生产域名(api.kuaigouai.com)下 nginx 会把 /share/* 反代到
  // smart-router 渲染（首页带工单框）；staging 域名下跳到主站完整 URL。
  // 用 location.host 判断当前是哪个环境
  const onMainSite =
    typeof window !== 'undefined' &&
    /(^|\.)api\.kuaigouai\.com$/.test(window.location.host)
  const supportUrl = onMainSite
    ? '/share/?support=1'
    : 'https://api.kuaigouai.com/share/?support=1'
  return (
    <a
      href={supportUrl}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='客服'
      className='kg-fab-support'
    >
      <span aria-hidden>💬</span>
      <span className='kg-fab-support-label'>客服</span>
      <style>{`
        .kg-fab-support {
          position: fixed; right: 24px; bottom: 24px; z-index: 999999;
          height: 48px; padding: 0 18px;
          background: #0F172A; color: #fff;
          border: 0; border-radius: 24px;
          box-shadow: 0 4px 16px rgba(15,23,42,.2), 0 1px 4px rgba(15,23,42,.1);
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; font-size: 14px; font-weight: 500;
          text-decoration: none;
          cursor: pointer; user-select: none;
          transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .kg-fab-support:hover {
          background: #1A56DB;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(26,86,219,.3);
        }
        @media (max-width: 640px) {
          .kg-fab-support { right: 16px; bottom: 16px; padding: 0; width: 48px; border-radius: 24px; }
          .kg-fab-support-label { display: none; }
        }
      `}</style>
    </a>
  )
}
