/*
浮动客服按钮 — 跳转主站工单页（api.kuaigouai.com/share/services）

为什么不在 staging 内嵌完整工单 widget：
- 主站工单系统在 smart-router（独立服务），有自己的 /api/tickets/*
- staging 用 NewAPI 后端，没有这些接口
- 跨域调主站需要 CORS + cookie SameSite=None 配置，复杂且 staging 用户体系不通
- 测试环境的工单本来就应该走主站统一处理 → 跳转最稳

样式 mirror 主站 #kg-tk-fab（cms_layout.html L967）。
*/

export function FloatingSupportButton() {
  const supportUrl = 'https://api.kuaigouai.com/share/services?from=staging'
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
