/**
 * Content Script - Scraper uniquement (pas d'UI)
 * Scrape les commandes et envoie les données au background
 * URL: https://www.vinted.fr/my_orders?order_type=sold
 */

(function() {
  'use strict';

  console.log('[Scraper] Content script initialisé');

  /**
   * Fonction utilitaire pour évaluer un XPath
   */
  function getElementByXPath(xpath, contextNode = document) {
    return document.evaluate(
      xpath,
      contextNode,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  }

  /**
   * Fonction utilitaire pour évaluer un XPath retournant plusieurs éléments
   */
  function getElementsByXPath(xpath, contextNode = document) {
    const result = document.evaluate(
      xpath,
      contextNode,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    const nodes = [];
    for (let i = 0; i < result.snapshotLength; i++) {
      nodes.push(result.snapshotItem(i));
    }
    return nodes;
  }

  /**
   * Nettoie le texte en supprimant les espaces inutiles et &nbsp;
   */
  function cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Attend la présence d'au moins un élément de commande dans le DOM
   */
  function waitForOrdersToLoad() {
    return new Promise((resolve) => {
      const checkExisting = document.querySelector('a[data-testid="my-orders-item"]');
      if (checkExisting) {
        console.log('[Scraper] Commandes déjà présentes');
        resolve();
        return;
      }

      console.log('[Scraper] Attente du chargement...');

      const observer = new MutationObserver((mutations, obs) => {
        const orderElement = document.querySelector('a[data-testid="my-orders-item"]');
        if (orderElement) {
          console.log('[Scraper] Commandes détectées');
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 10000);
    });
  }

  /**
   * Clique sur le bouton "toutes" si nécessaire
   */
  async function ensureAllFilterIsActive() {
    console.log('[Scraper] Vérification du filtre "toutes"...');

    const buttonXPath = '//*[@id="content"]/div/div[1]/div/div[1]/div[1]/div/div/div/div/div/article[1]/button';
    const button = getElementByXPath(buttonXPath);

    if (button) {
      console.log('[Scraper] Clic sur le bouton "toutes"...');
      button.click();
      await waitForOrdersToLoad();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[Scraper] Filtre "toutes" activé');
    } else {
      console.log('[Scraper] Bouton "toutes" non trouvé (déjà actif)');
    }
  }

  /**
   * Scrape toutes les commandes de la page
   */
  function scrapeOrders() {
    console.log('[Scraper] Démarrage du scraping...');

    const orderElements = getElementsByXPath('//*[@data-testid="my-orders-item"]');
    console.log(`[Scraper] ${orderElements.length} commande(s) trouvée(s)`);

    const ordersData = [];

    orderElements.forEach((orderElement, index) => {
      try {
        const titleElement = getElementByXPath('.//*[@data-testid="my-orders-item--title"]', orderElement);
        const contentElement = getElementByXPath('.//*[@data-testid="my-orders-item--content"]', orderElement);

        let priceElement = null;
        let statusElement = null;

        if (contentElement) {
          const h3Elements = getElementsByXPath('.//h3', contentElement);
          priceElement = h3Elements[0] || null;
          statusElement = h3Elements[1] || null;
        }

        const nom = cleanText(titleElement?.textContent || 'N/A');
        const prix = cleanText(priceElement?.textContent || 'N/A');
        const statut = cleanText(statusElement?.textContent || 'N/A');
        const href = orderElement.getAttribute('href');
        const inbox_url = href ? `https://www.vinted.fr${href}` : 'N/A';

        const orderData = {
          nom,
          prix,
          statut,
          inbox_url
        };

        ordersData.push(orderData);
        console.log(`[Scraper] Commande ${index + 1}:`, orderData);

      } catch (error) {
        console.error(`[Scraper] Erreur commande ${index + 1}:`, error);
      }
    });

    console.log('[Scraper] Scraping terminé:', ordersData);
    return ordersData;
  }

  /**
   * Écoute les messages du background/popup
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Scraper] Message reçu:', message);

    if (message.type === 'START_SCRAPING') {
      handleScraping(sendResponse);
      return true; // Permet une réponse asynchrone
    }

    return false;
  });

  /**
   * Gère le processus de scraping
   */
  async function handleScraping(sendResponse) {
    try {
      console.log('[Scraper] Début du scraping...');

      // Étape 1: S'assurer que le filtre "toutes" est actif
      await ensureAllFilterIsActive();

      // Étape 2: Attendre que les commandes soient chargées
      await waitForOrdersToLoad();

      // Étape 3: Scraper les données
      const data = scrapeOrders();

      // Étape 4: Renvoyer les données au background
      sendResponse({
        success: true,
        data: data,
        count: data.length
      });

      console.log('[Scraper] Données envoyées au background');

    } catch (error) {
      console.error('[Scraper] Erreur:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }

  console.log('[Scraper] Prêt à scraper les commandes');

})();
