/**
 * Content Script pour les pages inbox - Scraping des informations de suivi
 * S'exécute sur https://www.vinted.fr/inbox/*
 */

(function() {
  'use strict';

  console.log('[Inbox Tracking] Content script initialisé');

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
   * Nettoie le texte
   */
  function cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Détecte le transporteur à partir de l'URL
   */
  function detectCarrier(trackingUrl) {
    if (!trackingUrl) return 'Inconnu';

    const url = trackingUrl.toLowerCase();

    if (url.includes('mondialrelay')) return 'Mondial Relay';
    if (url.includes('colissimo')) return 'Colissimo';
    if (url.includes('laposte')) return 'La Poste';
    if (url.includes('chronopost')) return 'Chronopost';
    if (url.includes('ups')) return 'UPS';
    if (url.includes('dpd')) return 'DPD';
    if (url.includes('gls')) return 'GLS';

    return 'Inconnu';
  }

  /**
   * Scrape les informations de suivi
   */
  async function scrapeTrackingInfo() {
    console.log('[Inbox Tracking] Scraping des informations de suivi...');

    try {
      // Attendre que la page soit chargée
      await new Promise(resolve => setTimeout(resolve, 500));

      // 1. Récupérer la date de vente
      const dateXPath = '//*[@id="content"]/div/div/div[1]/div/div/div/div/div[2]/div/div[6]/div/div/div/div[10]/h4/span';
      const dateElement = getElementByXPath(dateXPath);
      const dateVente = dateElement ? (dateElement.getAttribute('title') || cleanText(dateElement.textContent)) : null;

      console.log('[Inbox Tracking] Date de vente:', dateVente);

      // 2. Cliquer sur "informations de suivi"
      const trackingLinkXPath = '//*[@id="content"]/div/div/div[1]/div/div/div/div/div[2]/div/div[6]/div/div/div/div[17]/span/div/div/div/div/div/div[2]/span/a';
      const trackingLink = getElementByXPath(trackingLinkXPath);

      if (!trackingLink) {
        console.warn('[Inbox Tracking] Lien "informations de suivi" non trouvé');
        return { dateVente, numeroSuivi: null, transporteur: null };
      }

      trackingLink.click();
      console.log('[Inbox Tracking] Clic sur "informations de suivi"');

      // 3. Attendre l'ouverture du pop-up
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 4. Récupérer le numéro de suivi dans le pop-up
      const trackingNumberXPath = '/html/body/div[17]/div/div/div[3]/div[1]/div/div/div/div/div[2]/div/div/div/div[1]/div/div/div[2]/div/h2';
      const trackingNumberElement = getElementByXPath(trackingNumberXPath);
      const numeroSuivi = trackingNumberElement ? cleanText(trackingNumberElement.textContent) : null;

      console.log('[Inbox Tracking] Numéro de suivi:', numeroSuivi);

      // 5. Récupérer le lien transporteur
      const carrierLinkXPath = '/html/body/div[17]/div/div/div[3]/div[1]/div/div/div/div/div[4]/div/div/h4/a';
      const carrierLink = getElementByXPath(carrierLinkXPath);
      const carrierUrl = carrierLink ? carrierLink.getAttribute('href') : null;
      const transporteur = detectCarrier(carrierUrl);

      console.log('[Inbox Tracking] Transporteur:', transporteur);

      return {
        dateVente,
        numeroSuivi,
        transporteur
      };

    } catch (error) {
      console.error('[Inbox Tracking] Erreur:', error);
      return {
        dateVente: null,
        numeroSuivi: null,
        transporteur: null
      };
    }
  }

  /**
   * Écoute les messages du background
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Inbox Tracking] Message reçu:', message);

    if (message.type === 'SCRAPE_TRACKING_INFO') {
      scrapeTrackingInfo().then(data => {
        sendResponse({
          success: true,
          data: data
        });
      }).catch(error => {
        sendResponse({
          success: false,
          error: error.message
        });
      });
      return true; // Permet une réponse asynchrone
    }

    return false;
  });

  console.log('[Inbox Tracking] Prêt à scraper les infos de suivi');

})();
