// dsh-ui-boost —— DSH 界面增强（浏览器半端）
// 持久客户端插件，由 dsh-client-modules 以 /plugins/dsh-ui-boost/client.js 提供。
// 模块格式：window.__ModuleLoader__.load({ id, factory(require) })，导出 { inject, apply }。
// restart-marker: 14（改动本文件任意内容 → client-hmr 内容哈希变化 → 插件自动热重载重启）
window.__ModuleLoader__.load({
  id: 'dsh-ui-boost',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    var react = require('react');

    // ================= 样式（模块级注入一次） =================
    var CSS = [
      // Tool 卡片默认折叠：正文默认隐藏，点击行（DisclosureRow 置 data-open）才展开
      '.o3BgMG_root .o3BgMG_bodyWrap{display:none!important}',
      '.o3BgMG_row[data-open] .o3BgMG_bodyWrap{display:flex!important}',
      // 悬浮面板层（由输入框上方的 🎨 按钮触发、向上展开；无独立悬浮按钮）
      '.dshub-overlay{position:fixed;inset:0;pointer-events:none;z-index:9990}',
      '.dshub-panel{position:fixed;width:292px;box-sizing:border-box;border-radius:14px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 12px 36px rgba(15,23,42,.28);pointer-events:auto;padding:14px 14px 12px;font-size:13px;line-height:1.5;animation:dshubPop .14s ease;max-height:calc(100vh - 120px);overflow-y:auto}',
      '@keyframes dshubPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
      '.dshub-title{display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:13px;margin-bottom:10px}',
      '.dshub-close{border:none;background:none;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:14px;padding:2px 4px;border-radius:6px}',
      '.dshub-close:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dshub-group{margin:12px 0 4px;font-size:11px;color:var(--dsw-alias-label-secondary);letter-spacing:.04em}',
      '.dshub-slider{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dshub-slider input[type=range]{flex:1;min-width:0;accent-color:var(--dsw-alias-brand-primary)}',
      '.dshub-slider b{flex:none;min-width:34px;text-align:right;font-weight:500;color:var(--dsw-alias-label-primary)}',
      '.dshub-row{display:flex;align-items:center;justify-content:space-between;margin-top:6px}',
      '.dshub-switch{height:24px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px}',
      '.dshub-switch-on{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}',
      '.dshub-note{margin-top:12px;font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.dshub-presets{display:flex;gap:6px;margin-top:6px}',
      '.dshub-preset{flex:1;height:28px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px}',
      '.dshub-preset-active{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}',
      // 输入区状态条
      '.dshub-dock{box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));margin:0 auto}',
      '.dshub-bar{box-sizing:border-box;display:flex;align-items:center;gap:8px;width:100%;max-width:calc(var(--dsh-composer-card-max-width) - 4 * var(--dsh-composer-dock-inset));height:30px;margin:0 auto;padding:0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.dshub-dot{width:8px;height:8px;border-radius:999px;background:var(--dsw-alias-state-success-primary);flex:none}',
      '.dshub-dot-running{background:var(--dsw-alias-brand-primary);animation:dshubPulse 1.2s ease-in-out infinite}',
      '@keyframes dshubPulse{0%,100%{opacity:1}50%{opacity:.35}}',
      '.dshub-seg{white-space:nowrap}',
      '.dshub-spacer{flex:1}',
      '.dshub-mini{border:none;background:none;cursor:pointer;font-size:14px;padding:2px 4px;border-radius:6px;color:var(--dsw-alias-label-secondary)}',
      '.dshub-mini:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      // 状态条关闭时：只保留一个右对齐的 🎨 按钮，面板不会失去入口
      '.dshub-dockbare{display:flex;justify-content:flex-end;padding:0 2px}',
      // ===== 背景板已移除（用户反馈：与 RGB 调色重复）=====
      // ===== QQ 聊天模式（html.dshub-qq 门控）— 选择器按运行版实测 =====
      // 用户消息：图片与文字同处一个气泡（userStack 即气泡本体），ME 圆形头像在气泡右侧
      'html.dshub-qq .LOmM4q_userRow{position:relative;padding-right:52px}',
      'html.dshub-qq .LOmM4q_userRow::after{content:"ME";position:absolute;right:0;top:0;width:40px!important;height:40px!important;border-radius:50%!important;aspect-ratio:1/1;display:grid;place-items:center;font-size:13px;font-weight:600;color:#fff;background:linear-gradient(135deg,#0099ff,#00c8ff);box-shadow:0 2px 8px rgba(0,153,255,.28)}',
      'html.dshub-qq .LOmM4q_userStack{position:relative;background:color-mix(in srgb,var(--dsw-alias-bg-layer-2) 92%,#000 8%);border-radius:16px;padding:10px 14px!important}',
      // 去掉内层文字气泡（只保留 userStack 这一层气泡）
      'html.dshub-qq .LOmM4q_userStack [data-message-bubble]{background:transparent!important;border:none!important;border-radius:0!important;box-shadow:none!important;padding:0!important}',
      // 图片随气泡宽度自适应（不再撑破气泡）
      'html.dshub-qq .LOmM4q_attachmentRow{max-width:100%!important;justify-content:flex-end;gap:8px}',
      'html.dshub-qq .LOmM4q_attachmentRow [class*="_imageItem"]{width:auto!important;height:auto!important;max-width:100%;max-height:220px}',
      'html.dshub-qq .LOmM4q_attachmentRow [class*="_thumbnail"]{width:auto!important;height:auto!important;max-width:100%;max-height:220px;border-radius:12px!important;overflow:hidden}',
      'html.dshub-qq .LOmM4q_attachmentRow [class*="_thumbnail"] img{width:auto!important;height:auto!important;max-width:100%;max-height:220px;border-radius:12px!important;object-fit:contain}',
      // 一轮对话一个气泡：同回合的流项合并为一个连续气泡（统一宽度，右边缘对齐）
      'html.dshub-qq .dshub-turn-first{position:relative;box-sizing:border-box;background:var(--dshub-bubble,color-mix(in srgb,var(--dsw-alias-bg-layer-1) 96%,#4d8dff 4%))!important;border-radius:16px 16px 0 0!important;margin-top:12px!important;padding:12px 18px 4px!important;width:100%;max-width:82%}',
      'html.dshub-qq .dshub-turn-mid{box-sizing:border-box;background:var(--dshub-bubble,color-mix(in srgb,var(--dsw-alias-bg-layer-1) 96%,#4d8dff 4%))!important;border-radius:0!important;margin-top:0!important;padding:4px 18px!important;width:100%;max-width:82%}',
      'html.dshub-qq .dshub-turn-last{box-sizing:border-box;background:var(--dshub-bubble,color-mix(in srgb,var(--dsw-alias-bg-layer-1) 96%,#4d8dff 4%))!important;border-radius:0 0 16px 16px!important;margin-top:0!important;padding:4px 18px 14px!important;width:100%;max-width:82%}',
      'html.dshub-qq .dshub-turn-single{border-radius:16px!important}',
      'html.dshub-qq .dshub-turn-first::before{content:"DS";position:absolute;left:-52px;top:10px;width:40px!important;height:40px!important;border-radius:50%!important;aspect-ratio:1/1;display:grid;place-items:center;font-size:13px;font-weight:600;color:#fff;background:linear-gradient(135deg,#8e6bff,#4d8dff);box-shadow:0 2px 8px rgba(77,141,255,.28)}',
      // 助手步骤内容不再单独加气泡（交给回合分组）；工具行进气泡内不再额外缩进
      'html.dshub-qq .xMeOpW_root{padding-left:52px;max-width:100%}',
      'html.dshub-qq .xMeOpW_actions{margin-left:0}',
      'html.dshub-qq [data-chat-flow-kind="tool-call"]:not(.dshub-turn-first):not(.dshub-turn-mid):not(.dshub-turn-last){padding-left:52px}',
      // 输入框 QQ 化
      'html.dshub-qq [data-composer-card]{border-radius:18px!important;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1) 98%,#4d8dff 2%)!important}',
      // 侧栏：PC QQ 联系人列表
      'html.dshub-qq .wtg9ga_root{background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 96%,#4d8dff 4%)!important}',
      'html.dshub-qq .wnFoaW_sessionRow{height:50px!important;gap:8px!important;border-radius:10px!important}',
      'html.dshub-qq .wnFoaW_sessionRow .wnFoaW_slot{box-sizing:border-box;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4d8dff,#8e6bff);color:#fff;overflow:hidden;display:inline-flex;align-items:center;justify-content:center}',
      'html.dshub-qq .wnFoaW_sessionRow .wnFoaW_slot::before{content:"👤";font-size:15px;line-height:1}',
      'html.dshub-qq .wnFoaW_projectRow{height:40px!important;border-radius:10px!important}',
      'html.dshub-qq [class*="_sectionHeader"]{height:32px!important;font-size:12px!important}',
    ].join('\n');

    (function injectCss() {
      if (typeof document === 'undefined') return;
      var tagId = 'dsh-ui-boost/styles';
      if (document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') !== null) return;
      var tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-ui-boost';
      tag.dataset.pluginCss = tagId;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    })();

    // ================= 状态 =================
    var DEFAULTS = {
      dockOn: true,
      qqChat: false,
      tintOn: true, tintR: 120, tintG: 120, tintB: 255, tintA: 0.35,
    };
    var store = { panelOpen: false, anchor: null, subs: new Set(), ...DEFAULTS };

    function emit() { store.subs.forEach(function (fn) { fn(); }); }
    function subscribe(fn) { store.subs.add(fn); return function () { store.subs.delete(fn); }; }
    function useUiBoost() {
      var tick = react.useState(0);
      react.useEffect(function () { return subscribe(function () { tick[1](function (n) { return n + 1; }); }); }, []);
      return store;
    }
    function pickSettings() {
      return {
        dockOn: store.dockOn,
        qqChat: store.qqChat,
        tintOn: store.tintOn, tintR: store.tintR, tintG: store.tintG, tintB: store.tintB, tintA: store.tintA,
      };
    }
    function saveSettings() {
      try {
        fetch('/ui-boost/settings.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pickSettings()),
        }).catch(function () {});
      } catch (e) { /* fetch unavailable */ }
    }
    function loadSettings() {
      try {
        return fetch('/ui-boost/settings.json', { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(function (j) { return j && j.settings ? j.settings : {}; })
          .catch(function () { return {}; });
      } catch (e) { return Promise.resolve({}); }
    }

    function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

    // 输入 token 估算：CJK 字符按 1 token，其余按每 4 字符 1 token
    function estimateTokens(text) {
      if (!text) return 0;
      var cjk = 0, other = 0;
      for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if ((c >= 0x4E00 && c <= 0x9FFF) || (c >= 0x3400 && c <= 0x4DBF) || (c >= 0xF900 && c <= 0xFAFF) || (c >= 0x3040 && c <= 0x30FF)) cjk++;
        else other++;
      }
      return cjk + Math.ceil(other / 4);
    }

    // QQ：按回合合并气泡（一轮对话一个气泡）
    function applyTurnGroups() {
      if (typeof document === 'undefined') return;
      var flow = document.querySelector('[data-slot="conversation.chat.flow"]');
      if (flow === null) return;
      var kids = Array.prototype.slice.call(flow.children);
      kids.forEach(function (el) {
        if (el.classList) el.classList.remove('dshub-turn-first', 'dshub-turn-mid', 'dshub-turn-last', 'dshub-turn-single');
      });
      if (!store.qqChat) return;
      var run = [], runTurn = null;
      function isAssistantSide(el) {
        var k = el.getAttribute('data-chat-flow-kind') || '';
        return el.hasAttribute('data-chat-turn') && k !== 'user' && k !== 'steering';
      }
      function flush() {
        for (var i = 0; i < run.length; i++) {
          var el = run[i];
          if (run.length === 1) { el.classList.add('dshub-turn-first', 'dshub-turn-last', 'dshub-turn-single'); continue; }
          if (i === 0) el.classList.add('dshub-turn-first');
          else if (i === run.length - 1) el.classList.add('dshub-turn-last');
          else el.classList.add('dshub-turn-mid');
        }
        run = [];
      }
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (!el.getAttribute) continue;
        var side = isAssistantSide(el);
        var turn = el.getAttribute('data-chat-turn');
        if (side && run.length > 0 && turn === runTurn) run.push(el);
        else { flush(); if (side) { run = [el]; runTurn = turn; } }
      }
      flush();
    }

    // RGB 调色：表面 token 按调色混合；文字 token 取调色的反色
    // （混合模式会把文字一起染色，无法让文字保持异色相，故改为 token 方案）
    var TINT_TOKENS = [
      // 基础表面
      '--dsw-alias-bg-base', '--dsw-alias-bg-layer-1', '--dsw-alias-bg-layer-2', '--dsw-alias-bg-layer-3',
      '--dsw-alias-bg-overlay', '--dsw-alias-bg-skeleton', '--dsw-alias-bg-module-platform',
      '--dsw-alias-bg-multi-select', '--dsw-alias-bg-mask-1', '--dsw-alias-bg-mask-2', '--dsw-alias-bg-mask-3',
      // 卡片 / 代码 / diff / 提示
      '--dsw-alias-card-fill', '--dsw-alias-card-fill-hover', '--dsw-alias-card-tile-fill',
      '--dsw-alias-settings-card-fill', '--dsw-alias-onboarding-card-fill',
      '--dsw-alias-markdown-code-block', '--dsw-alias-markdown-code-block-banner', '--dsw-alias-markdown-inline-code',
      '--dsw-alias-markdown-tag', '--dsw-alias-markdown-citation', '--dsw-alias-markdown-placeholder',
      '--dsw-alias-code-diff-added', '--dsw-alias-code-diff-deleted',
      '--dsw-alias-file-diff-added-bg', '--dsw-alias-file-diff-deleted-bg',
      '--dsw-alias-hovercard-bg', '--dsw-alias-tooltip-bg', '--dsw-alias-tooltip-key-bg',
      '--dsw-alias-menu-group-header-fill',
      '--dsw-alias-interactive-bg-hover', '--dsw-alias-interactive-bg-hover-solid', '--dsw-alias-interactive-bg-active',
      // 边框
      '--dsw-alias-border-l1', '--dsw-alias-border-l2', '--dsw-alias-border-l2-darkmode-thin',
      '--dsw-alias-border-l3', '--dsw-alias-border-l4',
      // 组件表面
      '--dsw-specific-bubble', '--dsw-specific-bubble-highlight', '--dsw-specific-input-major',
      '--dsw-specific-tip', '--dsw-specific-menu', '--dsw-specific-selector',
      '--dsw-specific-sidebar-fill', '--dsw-specific-sidebar-nav-item-active',
      '--dsw-specific-file-upload-track', '--dsw-specific-login-input',
    ];
    var TINT_LABEL_TOKENS = ['--dsw-alias-label-primary', '--dsw-alias-label-secondary', '--dsw-alias-label-tertiary'];

    function parseRgb(v) {
      var s = String(v || '').trim();
      var m = /^#([0-9a-f]{6})$/i.exec(s);
      if (m) { var n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
      m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s);
      if (m) return [+m[1], +m[2], +m[3]];
      return null;
    }
    function mixRgb(orig, tint, a) {
      return 'rgb(' + Math.round(orig[0] * (1 - a) + tint[0] * a) + ','
        + Math.round(orig[1] * (1 - a) + tint[1] * a) + ','
        + Math.round(orig[2] * (1 - a) + tint[2] * a) + ')';
    }
    // 主题 token 定义在 body 上，且别名值多为 var(--dsw-static-*) 引用；
    // 用探针元素把 token 解析成真实颜色。
    function resolveTokenColor(body, token) {
      var probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;left:-99999px;top:0;width:1px;height:1px;pointer-events:none;z-index:-1';
      probe.style.backgroundColor = 'var(' + token + ')';
      body.appendChild(probe);
      var rgb = getComputedStyle(probe).backgroundColor;
      body.removeChild(probe);
      return parseRgb(rgb);
    }
    function removeTintProps() {
      var targets = [document.documentElement, document.body];
      TINT_TOKENS.concat(TINT_LABEL_TOKENS).forEach(function (k) {
        targets.forEach(function (el) { if (el) el.style.removeProperty(k); });
      });
    }
    function applyTint() {
      if (typeof document === 'undefined' || !document.body) return;
      var body = document.body;
      removeTintProps();
      if (!store.tintOn) return;
      var a = clamp(store.tintA, 0, 0.6);
      var C = [Math.round(store.tintR), Math.round(store.tintG), Math.round(store.tintB)];
      var inv = 'rgb(' + (255 - C[0]) + ',' + (255 - C[1]) + ',' + (255 - C[2]) + ')';
      TINT_TOKENS.forEach(function (k) {
        var orig = resolveTokenColor(body, k);
        if (orig) body.style.setProperty(k, mixRgb(orig, C, a));
      });
      TINT_LABEL_TOKENS.forEach(function (k) { body.style.setProperty(k, inv); });
    }

    // 页面级门控：QQ 模式通过 html.dshub-qq 类启用
    function applyFlags() {
      var root = typeof document !== 'undefined' ? document.documentElement : null;
      if (!root) return;
      if (store.qqChat) root.classList.add('dshub-qq'); else root.classList.remove('dshub-qq');
      applyTint();
      applyTurnGroups();
    }

    function change(patch) {
      Object.assign(store, patch);
      applyFlags();
      emit();
      saveSettings();
    }

    // ================= 面板：从触发按钮向上展开 =================
    function openPanelFrom(el) {
      var vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      var rect = el && typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : null;
      var left = rect ? Math.min(Math.max(rect.right - 292, 8), vw - 300) : vw - 300;
      var bottom = rect ? (typeof window !== 'undefined' ? window.innerHeight : 800) - rect.top + 8 : 76;
      store.anchor = { left: left, bottom: bottom };
      store.panelOpen = !store.panelOpen;
      emit();
    }
    function togglePanel() {
      store.panelOpen = !store.panelOpen;
      emit();
    }

    // ================= 组件 =================
    function StatusDock(props) {
      var s = useUiBoost();
      var openBtn = react.createElement('button', {
        type: 'button', className: 'dshub-mini',
        'aria-label': '打开界面增强面板', title: '界面增强',
        onClick: function (e) { openPanelFrom(e.currentTarget); },
      }, '🎨');
      // 状态条关闭时只留按钮，保证面板始终有唯一入口
      if (!s.dockOn) {
        return react.createElement('div', { className: 'dshub-dock dshub-dockbare' }, openBtn);
      }
      var session = props.session;
      var input = props.input;
      var running = !!(session && session.running);
      var queue = session && Array.isArray(session.queue) ? session.queue.length : 0;
      var nodes = session && Array.isArray(session.nodes) ? session.nodes.length : 0;
      var draftText = input && typeof input.draft === 'string' ? input.draft : '';
      var draft = draftText.length;
      var tokens = estimateTokens(draftText);
      return react.createElement('div', { className: 'dshub-dock' },
        react.createElement('div', { className: 'dshub-bar' },
          react.createElement('span', { className: running ? 'dshub-dot dshub-dot-running' : 'dshub-dot' }),
          react.createElement('span', { className: 'dshub-seg' }, running ? '运行中' : '就绪'),
          react.createElement('span', { className: 'dshub-seg' }, '消息 ' + nodes),
          react.createElement('span', { className: 'dshub-seg' }, '队列 ' + queue),
          react.createElement('span', { className: 'dshub-seg' }, '草稿 ' + draft + ' 字'),
          draft > 0 && react.createElement('span', { className: 'dshub-seg', title: '本次输入预计消耗（估算）' }, '≈' + tokens + ' tokens'),
          react.createElement('span', { className: 'dshub-spacer' }),
          openBtn
        )
      );
    }

    function SwitchRow(props) {
      return react.createElement('div', { className: 'dshub-row' },
        react.createElement('span', null, props.label),
        react.createElement('button', {
          type: 'button', role: 'switch', 'aria-checked': props.on,
          className: 'dshub-switch' + (props.on ? ' dshub-switch-on' : ''),
          onClick: props.onToggle,
        }, props.on ? '开' : '关')
      );
    }

    function SliderRow(props) {
      return react.createElement('div', { className: 'dshub-slider' },
        react.createElement('span', null, props.label),
        react.createElement('input', {
          type: 'range',
          min: props.min, max: props.max, step: props.step || 1,
          value: props.value,
          onChange: function (e) { props.onChange(Number(e.target.value)); },
        }),
        react.createElement('b', null, props.display)
      );
    }

    function PanelLayer() {
      var s = useUiBoost();
      var panelStyle = s.anchor ? { left: s.anchor.left + 'px', bottom: s.anchor.bottom + 'px' } : { right: '20px', bottom: '76px' };
      return react.createElement('div', { className: 'dshub-overlay' },
        s.panelOpen && react.createElement('div', { className: 'dshub-panel', style: panelStyle, role: 'dialog', 'aria-label': '界面增强' },
          react.createElement('div', { className: 'dshub-title' },
            react.createElement('span', null, '界面增强'),
            react.createElement('button', { type: 'button', className: 'dshub-close', 'aria-label': '关闭', onClick: function () { togglePanel(); } }, '✕')
          ),

          react.createElement('div', { className: 'dshub-group' }, 'QQ 聊天模式'),
          react.createElement(SwitchRow, {
            label: '气泡 + 联系人侧栏',
            on: s.qqChat,
            onToggle: function () { change({ qqChat: !s.qqChat }); },
          }),

          react.createElement('div', { className: 'dshub-group' }, 'RGB 调色（界面整体染色）'),
          react.createElement(SwitchRow, {
            label: '开启调色',
            on: s.tintOn,
            onToggle: function () { change({ tintOn: !s.tintOn }); },
          }),
          s.tintOn && react.createElement('div', null,
            react.createElement(SliderRow, {
              label: 'R 红', min: 0, max: 255, value: Math.round(s.tintR),
              display: String(Math.round(s.tintR)),
              onChange: function (v) { change({ tintR: v }); },
            }),
            react.createElement(SliderRow, {
              label: 'G 绿', min: 0, max: 255, value: Math.round(s.tintG),
              display: String(Math.round(s.tintG)),
              onChange: function (v) { change({ tintG: v }); },
            }),
            react.createElement(SliderRow, {
              label: 'B 蓝', min: 0, max: 255, value: Math.round(s.tintB),
              display: String(Math.round(s.tintB)),
              onChange: function (v) { change({ tintB: v }); },
            }),
            react.createElement(SliderRow, {
              label: '强度', min: 0, max: 60, value: Math.round(clamp(s.tintA, 0, 0.6) * 100),
              display: Math.round(clamp(s.tintA, 0, 0.6) * 100) + '%',
              onChange: function (v) { change({ tintA: v / 100 }); },
            })
          ),

          react.createElement('div', { className: 'dshub-group' }, '其他'),
          react.createElement(SwitchRow, {
            label: '输入区状态条',
            on: s.dockOn,
            onToggle: function () { change({ dockOn: !s.dockOn }); },
          }),
          react.createElement('div', { className: 'dshub-note' }, '设置自动保存到 ~/.dsh/ui-boost.json。')
        )
      );
    }

    // ================= 插件入口 =================
    function apply(ctx) {
      // 唯一入口：输入框上方的状态条按钮（conversation.input.dock）。
      // 右下悬浮按钮与侧栏底部按钮已按要求移除。
      var slots = ctx.get('slots');
      if (slots !== undefined) {
        slots.inject('conversation.input.dock', function () {
          return slots.register({ name: 'conversation.input.dock', id: 'ui-boost-status', order: 30, label: '状态条' }, StatusDock);
        });
        slots.inject('shell.overlay', function () {
          return slots.register({ name: 'shell.overlay', id: 'ui-boost-panel', order: 0, label: '界面增强' }, PanelLayer);
        });
      }

      // 先用默认值渲染，再异步加载持久化设置
      applyFlags();
      loadSettings().then(function (settings) {
        Object.assign(store, settings);
        applyFlags();
        emit();
      }).catch(function () {});

      // 主题/配色切换后重新应用调色（body 上的 inline 变量需要按新主题重算）
      try {
        ctx.on('theme/change', function () { applyTint(); });
      } catch (e) { /* ignore */ }
      // 启动时主题可能尚未就绪，延迟再应用一次
      setTimeout(function () { applyTint(); }, 800);

      // QQ 分组：定期按回合刷新气泡分组（消息流会持续变化）
      ctx.effect(function () {
        applyTurnGroups();
        var t = setInterval(applyTurnGroups, 900);
        return function () { clearInterval(t); };
      }, 'dsh-ui-boost: qq turn groups');

      // 卸载时清掉页面级 QQ 门控类与调色 token（html 与 body 都要清）
      ctx.effect(function () {
        return function () {
          try {
            document.documentElement.classList.remove('dshub-qq');
            removeTintProps();
            document.querySelectorAll('.dshub-turn-first,.dshub-turn-mid,.dshub-turn-last,.dshub-turn-single').forEach(function (el) {
              el.classList.remove('dshub-turn-first', 'dshub-turn-mid', 'dshub-turn-last', 'dshub-turn-single');
            });
          } catch (e) { /* ignore */ }
        };
      }, 'dsh-ui-boost: page cleanup');
    }

    // Cordis 服务级硬依赖：等 slots 服务就绪后再 apply，确保注册不会空跑。
    // （package.json 的 dsh.client.inject 是模块级图依赖，已不再需要。）
    exports.inject = ['slots'];
    exports.apply = apply;
    return module.exports;
  },
});
