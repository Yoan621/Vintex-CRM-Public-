/**
 * Vintex CRM - Floating Action Button (FAB)
 * Injecté sur vinted.fr — widget flottant pour scanner et synchroniser
 */

;(function () {
  'use strict'

  // Guard : ne s'injecte que sur vinted.fr
  if (!window.location.hostname.includes('vinted.fr')) return

  // Guard : évite la double injection
  if (document.getElementById('vtx-fab-root')) return

  // ─── Styles ──────────────────────────────────────────────────────────────────

  const style = document.createElement('style')
  style.textContent = `
    #vtx-fab-root * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* Conteneur principal */
    #vtx-fab-root {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }

    /* Panel */
    #vtx-fab-panel {
      background: #0E0E0E;
      border: 1px solid #1A1A1A;
      border-radius: 14px;
      padding: 8px;
      min-width: 200px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,60,243,0.08);
      transform-origin: bottom right;
      transform: scale(0.92) translateY(8px);
      opacity: 0;
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease;
      pointer-events: none;
    }
    #vtx-fab-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Séparateur */
    .vtx-divider {
      border: none;
      border-top: 1px solid #1A1A1A;
      margin: 4px 0;
    }

    /* Items du panel */
    .vtx-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 9px 12px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 10px;
      color: rgba(233,233,233,0.75);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: left;
    }
    .vtx-item:hover {
      background: #18181b;
      border-color: rgba(0,60,243,0.3);
      color: #E9E9E9;
    }
    .vtx-item:active { transform: scale(0.98); }
    .vtx-item:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .vtx-item:disabled:hover {
      background: transparent;
      border-color: transparent;
      color: rgba(233,233,233,0.75);
    }
    .vtx-item .vtx-icon {
      font-size: 15px;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }
    .vtx-item .vtx-label {
      flex: 1;
      line-height: 1.2;
    }
    .vtx-item .vtx-sublabel {
      font-size: 10px;
      color: rgba(233,233,233,0.3);
      display: block;
      margin-top: 1px;
    }

    /* Item Sync CRM — couleur success */
    .vtx-item.sync {
      color: rgba(0,217,142,0.8);
    }
    .vtx-item.sync:hover {
      background: rgba(0,217,142,0.08);
      border-color: rgba(0,217,142,0.25);
      color: #00D98E;
    }

    /* Item Paramètres */
    .vtx-item.settings {
      color: rgba(233,233,233,0.4);
    }

    /* Bouton principal FAB */
    #vtx-fab-btn {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #003CF3;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,60,243,0.5);
      transition: all 0.25s ease;
      position: relative;
      flex-shrink: 0;
    }
    #vtx-fab-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 24px rgba(0,60,243,0.65);
    }
    #vtx-fab-btn:active { transform: scale(0.97); }
    #vtx-fab-btn.open {
      background: #18181b;
      border: 1px solid #27272a;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    }

    /* Logo VC */
    .vtx-fab-logo {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.3px;
      pointer-events: none;
      transition: opacity 0.15s;
    }
    #vtx-fab-btn.open .vtx-fab-logo { opacity: 0; }

    /* Icône croix */
    .vtx-fab-close {
      position: absolute;
      width: 18px;
      height: 18px;
      opacity: 0;
      transition: opacity 0.15s;
      pointer-events: none;
      color: rgba(233,233,233,0.6);
    }
    #vtx-fab-btn.open .vtx-fab-close { opacity: 1; }

    /* Badge statut */
    #vtx-fab-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      pointer-events: none;
      transition: all 0.2s;
    }
    #vtx-fab-badge.hidden { display: none; }
    #vtx-fab-badge.scanning {
      background: #003CF3;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,60,243,0.5);
    }
    #vtx-fab-badge.success {
      background: #00D98E;
      color: #0E0E0E;
    }
    #vtx-fab-badge.error {
      background: #FF0000;
      color: #fff;
    }
  `
  document.head.appendChild(style)

  // ─── HTML ─────────────────────────────────────────────────────────────────────

  const root = document.createElement('div')
  root.id = 'vtx-fab-root'
  root.innerHTML = `
    <!-- Panel -->
    <div id="vtx-fab-panel">

      <!-- Scan -->
      <button class="vtx-item" data-action="scan" data-limit="10">
        <span class="vtx-icon">🔟</span>
        <span class="vtx-label">
          Scanner 10 articles
          <span class="vtx-sublabel">Rapide</span>
        </span>
      </button>
      <button class="vtx-item" data-action="scan" data-limit="50">
        <span class="vtx-icon">📋</span>
        <span class="vtx-label">
          Scanner 50 articles
        </span>
      </button>
      <button class="vtx-item" data-action="scan" data-limit="100">
        <span class="vtx-icon">📦</span>
        <span class="vtx-label">
          Scanner 100 articles
          <span class="vtx-sublabel">Complet</span>
        </span>
      </button>

      <hr class="vtx-divider" />

      <!-- Sync -->
      <button class="vtx-item sync" data-action="sync" id="vtx-sync-btn" disabled>
        <span class="vtx-icon">🔄</span>
        <span class="vtx-label">
          Sync CRM
          <span class="vtx-sublabel" id="vtx-sync-hint">Scanner d'abord</span>
        </span>
      </button>

      <hr class="vtx-divider" />

      <!-- Paramètres -->
      <button class="vtx-item settings" data-action="settings">
        <span class="vtx-icon">⚙️</span>
        <span class="vtx-label">Paramètres</span>
      </button>
    </div>

    <!-- Bouton principal -->
    <button id="vtx-fab-btn" title="Vintex CRM">
      <span class="vtx-fab-logo">VC</span>
      <svg class="vtx-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span id="vtx-fab-badge" class="hidden"></span>
    </button>
  `
  document.body.appendChild(root)

  // ─── Références DOM ───────────────────────────────────────────────────────────

  const fabBtn   = document.getElementById('vtx-fab-btn')
  const panel    = document.getElementById('vtx-fab-panel')
  const badge    = document.getElementById('vtx-fab-badge')
  const syncBtn  = document.getElementById('vtx-sync-btn')
  const syncHint = document.getElementById('vtx-sync-hint')

  // ─── État ─────────────────────────────────────────────────────────────────────

  let isOpen = false
  let hasData = false

  // Vérifie si des données scannées existent en storage
  chrome.storage.local.get(['vintex_last_scan'], (result) => {
    const lastScan = result['vintex_last_scan']
    const count = lastScan?.data?.length || 0
    if (count > 0) {
      hasData = true
      syncBtn.disabled = false
      syncHint.textContent = `${count} article(s) prêt(s)`
    }
  })

  // ─── Toggle panel ─────────────────────────────────────────────────────────────

  fabBtn.addEventListener('click', () => {
    isOpen = !isOpen
    panel.classList.toggle('open', isOpen)
    fabBtn.classList.toggle('open', isOpen)
  })

  // Ferme si clic en dehors
  document.addEventListener('click', (e) => {
    if (isOpen && !root.contains(e.target)) {
      isOpen = false
      panel.classList.remove('open')
      fabBtn.classList.remove('open')
    }
  })

  // ─── Badge helpers ────────────────────────────────────────────────────────────

  function showBadge(type, text) {
    badge.textContent = text
    badge.className = type
    badge.classList.remove('hidden')
  }

  function hideBadge(delay = 0) {
    if (delay) {
      setTimeout(() => badge.classList.add('hidden'), delay)
    } else {
      badge.classList.add('hidden')
    }
  }

  // ─── Actions ──────────────────────────────────────────────────────────────────

  panel.addEventListener('click', (e) => {
    const item = e.target.closest('[data-action]')
    if (!item || item.disabled) return

    const action = item.dataset.action
    const limit  = parseInt(item.dataset.limit, 10)

    // Ferme le panel
    isOpen = false
    panel.classList.remove('open')
    fabBtn.classList.remove('open')

    if (action === 'scan') {
      showBadge('scanning', '…')

      chrome.runtime.sendMessage({ type: 'START_SCRAPING', limit }, (response) => {
        if (chrome.runtime.lastError) {
          showBadge('error', '❌')
          hideBadge(3000)
          return
        }
        if (response && response.success) {
          showBadge('success', '✅')
          hasData = true
          syncBtn.disabled = false
          syncHint.textContent = `${limit} article(s) prêt(s)`
          hideBadge(4000)
        } else {
          showBadge('error', '❌')
          hideBadge(3000)
        }
      })
    }

    if (action === 'sync') {
      showBadge('scanning', '↑')

      chrome.runtime.sendMessage({ type: 'SYNC_CRM' }, (response) => {
        if (chrome.runtime.lastError) {
          showBadge('error', '❌')
          hideBadge(3000)
          return
        }
        if (response && response.success) {
          showBadge('success', '✅')
          hideBadge(4000)
        } else {
          showBadge('error', '❌')
          hideBadge(3000)
        }
      })
    }

    if (action === 'settings') {
      chrome.runtime.sendMessage({ type: 'OPEN_POPUP' })
    }
  })

  // ─── Écoute les mises à jour du background ────────────────────────────────────

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SCRAPING_PROGRESS') {
      showBadge('scanning', `${message.current}`)
    }
    if (message.type === 'SCRAPING_COMPLETE') {
      showBadge('success', '✅')
      hasData = true
      syncBtn.disabled = false
      syncHint.textContent = `${message.count || '?'} article(s)`
      hideBadge(4000)
    }
    if (message.type === 'SCRAPING_ERROR') {
      showBadge('error', '❌')
      hideBadge(3000)
    }
    if (message.type === 'SYNC_COMPLETE') {
      showBadge('success', '✅')
      hideBadge(4000)
    }
    if (message.type === 'SYNC_ERROR') {
      showBadge('error', '❌')
      hideBadge(3000)
    }
  })

})()
