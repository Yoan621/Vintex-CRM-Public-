/**
 * Vintex CRM - Content Script pour /inbox/*
 * Injecte un hook window.open puis clique sur le bouton de téléchargement
 */

console.log('[Content Inbox] Script chargé sur', window.location.href);

/**
 * Écoute les messages du background script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Content Inbox] Message reçu:', message);

  if (message.type === 'FETCH_SHIPPING_LABEL') {
    fetchShippingLabel()
      .then(labelUrl => {
        console.log('[Content Inbox] Bordereau trouvé:', labelUrl);

        // Envoyer l'URL au background script
        chrome.runtime.sendMessage({
          type: 'SHIPPING_LABEL_FOUND',
          conversationUrl: window.location.href,
          labelUrl: labelUrl
        });

        sendResponse({ success: true, labelUrl: labelUrl });
      })
      .catch(error => {
        console.error('[Content Inbox] Erreur lors de la récupération du bordereau:', error);

        // Notifier le background script de l'erreur
        chrome.runtime.sendMessage({
          type: 'SHIPPING_LABEL_ERROR',
          conversationUrl: window.location.href,
          error: error.message
        });

        sendResponse({ success: false, error: error.message });
      });

    return true; // Permet une réponse asynchrone
  }

  return false;
});

/**
 * Injecte le hook window.open puis clique sur le bouton
 */
async function fetchShippingLabel() {
  console.log('[Content Inbox] Injection du hook window.open...');

  return new Promise(async (resolve, reject) => {
    let labelUrl = null;
    let timeoutId = null;

    // Écouter les messages du script injecté
    window.addEventListener('message', function messageListener(event) {
      if (event.source !== window) return;
      if (event.data.type === 'SHIPPING_LABEL_URL_INTERCEPTED') {
        console.log('[Content Inbox] URL interceptée:', event.data.url);
        labelUrl = event.data.url;

        // Nettoyer
        clearTimeout(timeoutId);
        window.removeEventListener('message', messageListener);

        resolve(labelUrl);
      }
    });

    // Injecter le script qui hook window.open
    const injectedScript = document.createElement('script');
    injectedScript.src = chrome.runtime.getURL('content-inbox-injected.js');
    injectedScript.onload = async function() {
      console.log('[Content Inbox] Hook injecté, attente du bouton...');

      // Attendre que le bouton soit présent
      const downloadButton = await waitForElement('button[data-testid="download-shipping-label-button"]', 15000);

      if (!downloadButton) {
        clearTimeout(timeoutId);
        reject(new Error('Bouton de téléchargement du bordereau non trouvé'));
        return;
      }

      console.log('[Content Inbox] Bouton trouvé, clic en cours...');

      // Cliquer sur le bouton - cela va déclencher window.open qui sera intercepté
      downloadButton.click();

      // Timeout de 10 secondes pour recevoir l'URL
      timeoutId = setTimeout(() => {
        if (!labelUrl) {
          console.warn('[Content Inbox] Timeout: URL non reçue après 10 secondes');
          reject(new Error('Timeout: impossible de récupérer l\'URL du bordereau'));
        }
      }, 10000);
    };

    document.documentElement.appendChild(injectedScript);
  });
}

/**
 * Attend qu'un élément apparaisse dans le DOM
 */
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    // Vérifier si l'élément existe déjà
    const existingElement = document.querySelector(selector);
    if (existingElement) {
      return resolve(existingElement);
    }

    // Observer les changements du DOM
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout: élément ${selector} non trouvé après ${timeout}ms`));
    }, timeout);
  });
}

console.log('[Content Inbox] Script prêt');
