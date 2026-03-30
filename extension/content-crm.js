/**
 * Vintex CRM - Content Script injecté sur localhost:3002
 * Écoute les événements du bouton "Actualiser" et relaie vers le background
 */

console.log('[Vintex] Content script CRM chargé sur', window.location.href);

// Écoute les messages postés par la page CRM (React)
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.type !== 'VINTEX_TRIGGER_SYNC') return;

  console.log('[Vintex] Déclenchement sync reçu depuis le CRM');

  // Notifier la page que le sync a démarré
  window.postMessage({ type: 'VINTEX_SYNC_STATUS', status: 'started' }, '*');

  // Relayer au background service worker
  chrome.runtime.sendMessage({ type: 'TRIGGER_SYNC_FROM_CRM' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Vintex] Erreur background:', chrome.runtime.lastError.message);
      window.postMessage({
        type: 'VINTEX_SYNC_STATUS',
        status: 'error',
        message: chrome.runtime.lastError.message
      }, '*');
      return;
    }

    if (response && response.success) {
      window.postMessage({
        type: 'VINTEX_SYNC_STATUS',
        status: 'complete',
        ventesCount: response.ventesCount,
        achatsCount: response.achatsCount,
        created: response.created,
        updated: response.updated
      }, '*');
    } else {
      window.postMessage({
        type: 'VINTEX_SYNC_STATUS',
        status: 'error',
        message: response ? response.error : 'Erreur inconnue'
      }, '*');
    }
  });
});
