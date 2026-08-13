// syren-portfolio 路由 Worker
// 职责：根路径 / 返回占位页，/my/* 服务应用（含 SPA 回退）

const PLACEHOLDER_HTML = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fascinate</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F5F0EB;
        font-family: "Noto Serif SC", "Cormorant Garamond", serif;
        color: #4A3728;
      }
      .wrap { text-align: center; padding: 0 24px; }
      .brand {
        font-size: clamp(28px, 6vw, 48px);
        font-weight: 300;
        letter-spacing: 0.35em;
        margin-bottom: 24px;
      }
      .brand em { font-style: italic; font-weight: 500; }
      .line { width: 48px; height: 1px; background: #C4A882; margin: 0 auto 24px; }
      .note {
        font-size: 14px;
        letter-spacing: 0.2em;
        color: #6B6B4E;
        line-height: 2;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1 class="brand">FASCINATE<em>.</em></h1>
      <div class="line"></div>
      <p class="note">正在建设 · Coming Soon</p>
    </div>
  </body>
</html>`

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    // 根路径 → 占位页
    if (path === '/' || path === '/index.html') {
      return new Response(PLACEHOLDER_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    // /my 及 /my/* → 服务应用（静态资产优先，404 时 SPA 回退）
    if (path === '/my' || path.startsWith('/my/')) {
      const assetResponse = await env.ASSETS.fetch(request)
      if (assetResponse.status !== 404) {
        return assetResponse
      }
      // SPA 回退到 /my/index.html
      return env.ASSETS.fetch(new Request(new URL('/my/index.html', url), request))
    }

    // 其他路径 → 404
    return new Response('Not Found', { status: 404 })
  },
}
