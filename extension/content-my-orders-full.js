/**
 * Content Script - Scraper COMPLET VENTES + ACHATS
 * Avec extraction des informations de suivi pour chaque vente
 * URL de départ: https://www.vinted.fr/my_orders
 */

(function() {
  'use strict';

  console.log('[Scraper Full] Content script initialisé');

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
        console.log('[Scraper Full] Commandes déjà présentes');
        resolve();
        return;
      }

      console.log('[Scraper Full] Attente du chargement...');

      const observer = new MutationObserver((mutations, obs) => {
        const orderElement = document.querySelector('a[data-testid="my-orders-item"]');
        if (orderElement) {
          console.log('[Scraper Full] Commandes détectées');
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
      }, 15000);
    });
  }

  /**
   * Attend que l'URL change
   */
  function waitForUrlChange(expectedUrl) {
    return new Promise((resolve) => {
      const checkUrl = () => {
        if (window.location.href.includes(expectedUrl)) {
          console.log('[Scraper Full] URL changée vers:', window.location.href);
          resolve();
        } else {
          setTimeout(checkUrl, 100);
        }
      };
      checkUrl();

      setTimeout(() => resolve(), 10000);
    });
  }

  /**
   * Clique sur le bouton "toutes" si nécessaire
   */
  async function ensureAllFilterIsActive() {
    console.log('[Scraper Full] Vérification du filtre "toutes"...');

    const buttonXPath = '//*[@id="content"]/div/div[1]/div/div[1]/div[1]/div/div/div/div/div/article[1]/button';
    const button = getElementByXPath(buttonXPath);

    if (button) {
      console.log('[Scraper Full] Clic sur le bouton "toutes"...');
      button.click();
      await waitForOrdersToLoad();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[Scraper Full] Filtre "toutes" activé');
    } else {
      console.log('[Scraper Full] Bouton "toutes" non trouvé (déjà actif)');
    }
  }

  /**
   * Scroll automatique pour charger les commandes jusqu'au limit demandé
   * Si limit = 0, charge tout
   */
  async function scrollToLoadAll(limit = 0) {
    console.log(`[Scraper Full] Scroll (limit: ${limit || 'tout'})...`);

    let previousCount = 0;
    let stableAttempts = 0;
    const MIN_STABLE_ATTEMPTS = 3;
    const SCROLL_DELAY = 1500;

    const scrollToBottom = () => {
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    };

    while (true) {
      scrollToBottom();
      await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY));

      const currentCount = document.querySelectorAll('a[data-testid="my-orders-item"]').length;

      // Arrêt anticipé si on a atteint le limit
      if (limit > 0 && currentCount >= limit) {
        console.log(`[Scraper Full] ✅ Limit ${limit} atteint (${currentCount} chargés)`);
        return currentCount;
      }

      if (currentCount > previousCount) {
        console.log(`[Scraper Full] ${currentCount} commandes détectées (+${currentCount - previousCount})`);
        previousCount = currentCount;
        stableAttempts = 0;
      } else {
        stableAttempts++;
        if (stableAttempts >= MIN_STABLE_ATTEMPTS) {
          console.log(`[Scraper Full] ✅ Scroll terminé. Total: ${currentCount} commandes`);
          return currentCount;
        }
      }
    }
  }

  /**
   * Scrape les commandes de la page courante (liste)
   */
  function scrapeOrdersList(typeCommande) {
    console.log(`[Scraper Full] Démarrage du scraping de la liste ${typeCommande}...`);

    const orderElements = getElementsByXPath('//*[@data-testid="my-orders-item"]');
    console.log(`[Scraper Full] ${orderElements.length} commande(s) trouvée(s)`);

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
          type_commande: typeCommande,
          nom,
          prix,
          statut,
          inbox_url,
          // Champs à remplir plus tard pour les ventes
          date_vente: null,
          numero_suivi: null,
          transporteur: null
        };

        ordersData.push(orderData);

        if (index < 5 || index >= orderElements.length - 5) {
          console.log(`[Scraper Full] ${typeCommande} ${index + 1}/${orderElements.length}:`, orderData);
        }

      } catch (error) {
        console.error(`[Scraper Full] Erreur commande ${index + 1}:`, error);
      }
    });

    console.log(`[Scraper Full] Scraping de la liste ${typeCommande} terminé: ${ordersData.length} commandes`);
    return ordersData;
  }

  /**
   * Enrichit une vente avec ses informations de suivi
   * Envoie un message au background pour ouvrir la page inbox dans un nouvel onglet
   */
  async function enrichSaleWithTracking(sale, index, total) {
    console.log(`[Scraper Full] Enrichissement de la vente ${index + 1}/${total}: ${sale.nom}`);

    return new Promise((resolve) => {
      // Envoyer un message au background pour qu'il ouvre la page inbox
      chrome.runtime.sendMessage({
        type: 'ENRICH_SALE_WITH_TRACKING',
        inboxUrl: sale.inbox_url
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(`[Scraper Full] Erreur:`, chrome.runtime.lastError);
          resolve(sale);
          return;
        }

        if (!response || !response.success) {
          console.warn(`[Scraper Full] Échec de l'enrichissement`);
          resolve(sale);
          return;
        }

        // Enrichir l'objet sale avec les données reçues
        sale.date_vente = response.data.dateVente;
        sale.numero_suivi = response.data.numeroSuivi;
        sale.transporteur = response.data.transporteur;

        console.log(`[Scraper Full] Vente enrichie:`, sale);
        resolve(sale);
      });
    });
  }

  /**
   * Navigue vers la page des achats
   */
  async function navigateToAchats() {
    console.log('[Scraper Full] Navigation vers les achats...');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    await new Promise(resolve => setTimeout(resolve, 500));

    const achatsLink = document.querySelector('a[href="/my_orders?order_type=purchased"]');

    if (!achatsLink) {
      console.error('[Scraper Full] Lien "Achats" non trouvé');
      throw new Error('Impossible de trouver le lien vers les achats');
    }

    console.log('[Scraper Full] Lien "Achats" trouvé, clic en cours...');
    achatsLink.click();

    await waitForUrlChange('order_type=purchased');
    await waitForOrdersToLoad();
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('[Scraper Full] Navigation vers les achats terminée');
  }

  /**
   * Écoute les messages du popup
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Scraper Full] Message reçu:', message);

    if (message.type === 'START_SCRAPING') {
      handleFullScraping(sendResponse, message.limit || 0);
      return true;
    }

    return false;
  });

  /**
   * Gère le processus complet de scraping
   */
  async function handleFullScraping(sendResponse, limit = 0) {
    try {
      console.log(`[Scraper Full] Début du scraping (limit: ${limit || 'tout'})...`);

      // ÉTAPE 1: Activer le filtre "toutes"
      await ensureAllFilterIsActive();
      await waitForOrdersToLoad();

      // ÉTAPE 3: Scroll pour charger les ventes jusqu'au limit
      await scrollToLoadAll(limit);

      // ÉTAPE 4: Scraper la liste des ventes (avec limit)
      let ventes = scrapeOrdersList('vente');
      if (limit > 0) ventes = ventes.slice(0, limit);
      console.log(`[Scraper Full] ${ventes.length} vente(s) scrapée(s)`);

      // ÉTAPE 5: Enrichir les ventes avec les infos de suivi EN PARALLÈLE
      console.log('[Scraper Full] Enrichissement des ventes avec les infos de suivi (parallèle)...');
      const BATCH_SIZE = 10; // Traiter 10 ventes en parallèle

      for (let i = 0; i < ventes.length; i += BATCH_SIZE) {
        const batch = ventes.slice(i, i + BATCH_SIZE);
        console.log(`[Scraper Full] Traitement du lot ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ventes.length / BATCH_SIZE)} (${batch.length} ventes)`);

        // Traiter le lot en parallèle
        const enrichedBatch = await Promise.all(
          batch.map((sale, idx) => enrichSaleWithTracking(sale, i + idx, ventes.length))
        );

        // Mettre à jour les ventes
        for (let j = 0; j < enrichedBatch.length; j++) {
          ventes[i + j] = enrichedBatch[j];
        }

        console.log(`[Scraper Full] Lot ${Math.floor(i / BATCH_SIZE) + 1} terminé`);
      }

      // ÉTAPE 6: Scraper les achats depuis la page actuelle (sans navigation)
      let achats = scrapeOrdersList('achat');
      if (limit > 0) achats = achats.slice(0, limit);
      console.log(`[Scraper Full] ${achats.length} achat(s) scrapé(s) depuis la page actuelle`);

      // ÉTAPE 9: Fusionner les résultats
      const allOrders = [...ventes, ...achats];
      console.log(`[Scraper Full] Total: ${allOrders.length} commande(s)`);

      // ÉTAPE 10: Renvoyer les données
      sendResponse({
        success: true,
        data: allOrders,
        count: allOrders.length,
        ventesCount: ventes.length,
        achatsCount: achats.length
      });

      console.log('[Scraper Full] Données envoyées au popup');

    } catch (error) {
      console.error('[Scraper Full] Erreur:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }

  console.log('[Scraper Full] Prêt à scraper ventes + achats (avec infos de suivi)');

})();
