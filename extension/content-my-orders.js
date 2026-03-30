/**
 * Vintex CRM - Content Script pour /my_orders
 * Scrape les informations des commandes sur la page https://www.vinted.fr/my_orders
 */

console.log('[Content My Orders] Script chargé');

/**
 * Écoute les messages du background script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Content My Orders] Message reçu:', message);

  if (message.type === 'SCAN_MY_ORDERS_PAGE') {
    scanMyOrdersPage()
      .then(orders => {
        console.log('[Content My Orders] Scan terminé:', orders.length, 'commande(s)');

        // Envoyer les données au background script
        chrome.runtime.sendMessage({
          type: 'MY_ORDERS_DATA',
          orders: orders
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('[Content My Orders] Erreur:', chrome.runtime.lastError);
          }
        });

        sendResponse({ success: true, count: orders.length });
      })
      .catch(error => {
        console.error('[Content My Orders] Erreur lors du scan:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Permet une réponse asynchrone
  }

  return false;
});

/**
 * Scanne la page /my_orders et extrait les informations des commandes
 */
async function scanMyOrdersPage() {
  console.log('[Content My Orders] Démarrage du scan de la page...');

  // Attendre que la page soit complètement chargée
  await waitForPageLoad();

  const orders = [];

  // Sélectionner tous les éléments de commande
  const orderElements = document.querySelectorAll('a[data-testid="my-orders-item"]');

  console.log(`[Content My Orders] ${orderElements.length} commande(s) trouvée(s)`);

  orderElements.forEach((element, index) => {
    try {
      const order = extractOrderData(element);
      if (order) {
        orders.push(order);
        console.log(`[Content My Orders] Commande ${index + 1}:`, order);
      }
    } catch (error) {
      console.error(`[Content My Orders] Erreur lors de l'extraction de la commande ${index + 1}:`, error);
    }
  });

  return orders;
}

/**
 * Extrait les données d'une commande depuis son élément DOM
 */
function extractOrderData(element) {
  // URL de la conversation
  const conversationPath = element.getAttribute('href');
  if (!conversationPath) {
    console.warn('[Content My Orders] Pas d\'URL de conversation trouvée');
    return null;
  }
  const conversationUrl = `https://www.vinted.fr${conversationPath}`;

  // Titre de l'article
  const titleElement = element.querySelector('[data-testid="my-orders-item--title"]');
  const title = titleElement ? titleElement.textContent.trim() : 'Titre non trouvé';

  // Contenu du body (prix et statut)
  const bodyElement = element.querySelector('[data-testid="my-orders-item--content"]');

  let price = 'Prix non trouvé';
  let status = 'Statut non trouvé';

  if (bodyElement) {
    // Récupérer tous les h3 avec la classe web_ui__Text__subtitle
    const subtitles = bodyElement.querySelectorAll('h3.web_ui__Text__subtitle');

    if (subtitles.length >= 1) {
      // Le premier h3 contient généralement le prix
      price = subtitles[0].textContent.trim();
    }

    if (subtitles.length >= 2) {
      // Le second h3 contient généralement le statut
      status = subtitles[1].textContent.trim();
    }
  }

  // Extraire l'ID de la commande depuis l'URL (optionnel)
  const orderIdMatch = conversationPath.match(/\/inbox\/(\d+)/);
  const orderId = orderIdMatch ? orderIdMatch[1] : null;

  return {
    orderId: orderId,
    title: title,
    price: price,
    status: status,
    conversationUrl: conversationUrl
  };
}

/**
 * Attend que la page soit complètement chargée
 */
function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

/**
 * Utilitaire pour attendre qu'un élément apparaisse dans le DOM
 */
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout: élément ${selector} non trouvé`));
    }, timeout);
  });
}

console.log('[Content My Orders] Script prêt');
