/*
浮动客服按钮 — 跳转主站独立工单页 /support（落地即自动弹出工单框）

为什么不在 React 壳内嵌完整工单 widget：
- 工单系统在 smart-router（独立服务），有自己的 /api/tickets/*、模态框、widget JS
- staging 用 NewAPI 后端，没有这些接口；跨域调主站要 CORS + cookie SameSite=None，复杂
- 统一走主站 smart-router 的 /support 页最稳

/support：smart-router 专门的客服页（nginx location = /support → :8000），
内含 #kg-tk-fab 模态框，ticket-widget.js 检测 pathname=/support 自动 openModal。
历史：曾误指 /share/services（文章）、再到 /share/?support=1（翻转 React 后那页没工单框）。

样式 mirror 主站 #kg-tk-fab（cms_layout.html）。
*/

export function FloatingSupportButton() {
  // 同源相对 URL：生产域名(api.kuaigouai.com)下 /support 由 nginx 反代到 smart-router；
  // staging 等其他域名下跳到主站完整 URL。
  const onMainSite =
    typeof window !== 'undefined' &&
    /(^|\.)api\.kuaigouai\.com$/.test(window.location.host)
  const supportUrl = onMainSite
    ? '/support'
    : 'https://api.kuaigouai.com/support'
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
