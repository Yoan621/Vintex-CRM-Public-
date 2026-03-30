/**
 * Content Script - Scraper Vinted My Orders avec export CSV
 * URL: https://www.vinted.fr/my_orders?order_type=sold
 * Extension Chrome Manifest V3
 */

(function() {
  'use strict';

  console.log('[Vinted CSV Scraper] Script initialisé');

  // Stockage des données scrapées
  let ordersData = [];

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
      .replace(/\u00A0/g, ' ') // Remplacer &nbsp; par espace normal
      .replace(/\s+/g, ' ')     // Réduire les espaces multiples
      .trim();                   // Supprimer les espaces en début/fin
  }

  /**
   * Attend la présence d'au moins un élément de commande dans le DOM
   */
  function waitForOrdersToLoad() {
    return new Promise((resolve) => {
      // Vérifier si les éléments sont déjà présents
      const checkExisting = document.querySelector('a[data-testid="my-orders-item"]');
      if (checkExisting) {
        console.log('[Vinted CSV Scraper] Commandes déjà présentes dans le DOM');
        resolve();
        return;
      }

      console.log('[Vinted CSV Scraper] Attente du chargement des commandes...');

      // Utiliser MutationObserver pour détecter l'apparition des commandes
      const observer = new MutationObserver((mutations, obs) => {
        const orderElement = document.querySelector('a[data-testid="my-orders-item"]');
        if (orderElement) {
          console.log('[Vinted CSV Scraper] Commandes détectées dans le DOM');
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Timeout de sécurité après 10 secondes
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
    console.log('[Vinted CSV Scraper] Vérification du filtre "toutes"...');

    const buttonXPath = '//*[@id="content"]/div/div[1]/div/div[1]/div[1]/div/div/div/div/div/article[1]/button';
    const button = getElementByXPath(buttonXPath);

    if (button) {
      console.log('[Vinted CSV Scraper] Bouton "toutes" trouvé, clic en cours...');

      // Clic réel sur l'élément
      button.click();

      // Attendre le rechargement du DOM
      await waitForOrdersToLoad();

      // Petit délai supplémentaire pour être sûr que le DOM est stabilisé
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('[Vinted CSV Scraper] Filtre "toutes" activé');
    } else {
      console.log('[Vinted CSV Scraper] Bouton "toutes" non trouvé (peut-être déjà actif)');
    }
  }

  /**
   * Scrape toutes les commandes de la page
   */
  function scrapeOrders() {
    console.log('[Vinted CSV Scraper] Démarrage du scraping...');

    // Sélectionner tous les éléments de commande
    const orderElements = getElementsByXPath('//*[@data-testid="my-orders-item"]');
    console.log(`[Vinted CSV Scraper] ${orderElements.length} commande(s) trouvée(s)`);

    ordersData = [];

    orderElements.forEach((orderElement, index) => {
      try {
        // XPath relatifs pour extraire les données
        const titleElement = getElementByXPath('.//*[@data-testid="my-orders-item--title"]', orderElement);
        const contentElement = getElementByXPath('.//*[@data-testid="my-orders-item--content"]', orderElement);

        let priceElement = null;
        let statusElement = null;

        if (contentElement) {
          const h3Elements = getElementsByXPath('.//h3', contentElement);
          priceElement = h3Elements[0] || null;
          statusElement = h3Elements[1] || null;
        }

        // Extraire les données
        const nom = cleanText(titleElement?.textContent || 'N/A');
        const prix = cleanText(priceElement?.textContent || 'N/A');
        const statut = cleanText(statusElement?.textContent || 'N/A');
        const href = orderElement.getAttribute('href');
        const inboxUrl = href ? `https://www.vinted.fr${href}` : 'N/A';

        // Créer l'objet de données
        const orderData = {
          nom,
          prix,
          statut,
          inbox_url: inboxUrl
        };

        ordersData.push(orderData);
        console.log(`[Vinted CSV Scraper] Commande ${index + 1}:`, orderData);

      } catch (error) {
        console.error(`[Vinted CSV Scraper] Erreur lors du scraping de la commande ${index + 1}:`, error);
      }
    });

    console.log('[Vinted CSV Scraper] Scraping terminé:', ordersData);
    return ordersData;
  }

  /**
   * Convertit les données en CSV
   */
  function convertToCSV(data) {
    if (data.length === 0) {
      return 'nom,prix,statut,inbox_url\n';
    }

    // En-têtes CSV
    const headers = ['nom', 'prix', 'statut', 'inbox_url'];
    let csv = headers.join(',') + '\n';

    // Lignes de données
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Échapper les guillemets et encadrer par des guillemets si nécessaire
        const escaped = value.replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')
          ? `"${escaped}"`
          : escaped;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  /**
   * Télécharge le fichier CSV
   */
  function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    console.log(`[Vinted CSV Scraper] Fichier ${filename} téléchargé`);
  }

  /**
   * Crée et injecte le bouton "Télécharger CSV" dans la page
   */
  function createDownloadButton() {
    // Vérifier si le bouton existe déjà
    if (document.getElementById('vinted-csv-download-button')) {
      console.log('[Vinted CSV Scraper] Le bouton existe déjà');
      return;
    }

    // Créer le bouton
    const button = document.createElement('button');
    button.id = 'vinted-csv-download-button';
    button.textContent = '📥 Télécharger CSV';
    button.setAttribute('aria-label', 'Télécharger les commandes en CSV');

    // Style du bouton
    button.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      padding: 12px 24px;
      background: linear-gradient(135deg, #09B1BA 0%, #00D4BD 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 180, 186, 0.3);
      transition: all 0.3s ease;
      user-select: none;
    `;

    // Effets hover et active
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(0, 180, 186, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0, 180, 186, 0.3)';
    });

    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.98)';
    });

    button.addEventListener('mouseup', () => {
      button.style.transform = 'scale(1)';
    });

    // Action du bouton
    button.addEventListener('click', async () => {
      const originalText = button.textContent;
      button.textContent = '⏳ Scraping...';
      button.disabled = true;
      button.style.opacity = '0.7';
      button.style.cursor = 'wait';

      try {
        // Scraper les données
        const data = scrapeOrders();

        if (data.length === 0) {
          button.textContent = '❌ Aucune commande';
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
          }, 2000);
          return;
        }

        // Convertir en CSV
        const csv = convertToCSV(data);

        // Générer le nom du fichier
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `vinted-orders-${dateStr}-${timeStr}.csv`;

        // Télécharger
        downloadCSV(csv, filename);

        // Feedback visuel
        button.textContent = `✅ ${data.length} commande(s) exportée(s)`;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          button.style.opacity = '1';
          button.style.cursor = 'pointer';
        }, 3000);

      } catch (error) {
        console.error('[Vinted CSV Scraper] Erreur lors du téléchargement:', error);
        button.textContent = '❌ Erreur';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          button.style.opacity = '1';
          button.style.cursor = 'pointer';
        }, 2000);
      }
    });

    // Ajouter le bouton à la page
    document.body.appendChild(button);
    console.log('[Vinted CSV Scraper] Bouton "Télécharger CSV" créé et injecté');
  }

  /**
   * Initialisation du script
   */
  async function init() {
    try {
      console.log('[Vinted CSV Scraper] Initialisation...');

      // Étape 1: S'assurer que le filtre "toutes" est actif
      await ensureAllFilterIsActive();

      // Étape 2: Attendre que les commandes soient chargées
      await waitForOrdersToLoad();

      // Étape 3: Créer le bouton de téléchargement
      createDownloadButton();

      console.log('[Vinted CSV Scraper] Prêt ! Cliquez sur le bouton pour télécharger le CSV.');

    } catch (error) {
      console.error('[Vinted CSV Scraper] Erreur lors de l\'initialisation:', error);
    }
  }

  // Lancer l'initialisation quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
