/**
 * Script de test pour scraper la page /my_orders de Vinted
 * À exécuter dans la console du navigateur sur https://www.vinted.fr/my_orders
 */

(function() {
  'use strict';

  // Fonction pour scraper les commandes
  function scrapeOrders() {
    console.log('[Scraper] Démarrage du scraping...');

    // 1. Sélectionner tous les éléments de commande
    const orderElements = document.querySelectorAll('a[data-testid="my-orders-item"]');
    console.log(`[Scraper] ${orderElements.length} commande(s) trouvée(s)`);

    const orders = [];

    // 2. Pour chaque élément, extraire les données
    orderElements.forEach((orderElement, index) => {
      try {
        // Extraire le titre
        const titleElement = orderElement.querySelector('[data-testid="my-orders-item--title"]');
        const title = titleElement ? titleElement.textContent.trim() : 'Titre non trouvé';

        // Extraire le contenu (prix et statut)
        const contentElement = orderElement.querySelector('[data-testid="my-orders-item--content"]');
        const h3Elements = contentElement ? contentElement.querySelectorAll('h3') : [];

        const price = h3Elements[0] ? h3Elements[0].textContent.trim() : 'Prix non trouvé';
        const status = h3Elements[1] ? h3Elements[1].textContent.trim() : 'Statut non trouvé';

        // Extraire l'URL (href)
        const href = orderElement.getAttribute('href');
        const conversationUrl = href ? `https://www.vinted.fr${href}` : null;

        // Créer l'objet commande
        const order = {
          title,
          price,
          status,
          conversationUrl,
          scrapedAt: new Date().toISOString()
        };

        orders.push(order);
        console.log(`[Scraper] Commande ${index + 1}:`, order);

      } catch (error) {
        console.error(`[Scraper] Erreur lors du scraping de la commande ${index + 1}:`, error);
      }
    });

    return orders;
  }

  // Fonction pour télécharger le JSON
  function downloadJSON(data, filename) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    console.log(`[Scraper] Fichier ${filename} téléchargé`);
  }

  // Fonction pour créer le bouton de téléchargement
  function createDownloadButton() {
    // Vérifier si le bouton existe déjà
    if (document.getElementById('vinted-scraper-button')) {
      console.log('[Scraper] Le bouton existe déjà');
      return;
    }

    // Créer le bouton
    const button = document.createElement('button');
    button.id = 'vinted-scraper-button';
    button.textContent = '📥 Télécharger JSON des commandes';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    `;

    // Effet hover
    button.onmouseover = () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    };
    button.onmouseout = () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    };

    // Action au clic
    button.onclick = () => {
      button.textContent = '⏳ Scraping en cours...';
      button.disabled = true;

      setTimeout(() => {
        // Scraper les données
        const orders = scrapeOrders();

        if (orders.length === 0) {
          alert('Aucune commande trouvée sur cette page');
          button.textContent = '📥 Télécharger JSON des commandes';
          button.disabled = false;
          return;
        }

        // Préparer le payload
        const payload = {
          metadata: {
            totalOrders: orders.length,
            scrapedAt: new Date().toISOString(),
            source: 'vinted',
            page: window.location.href
          },
          orders: orders
        };

        // Générer le nom du fichier
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `vinted-orders-${dateStr}-${timeStr}.json`;

        // Télécharger
        downloadJSON(payload, filename);

        // Afficher le résultat
        button.textContent = `✅ ${orders.length} commande(s) téléchargée(s)`;
        setTimeout(() => {
          button.textContent = '📥 Télécharger JSON des commandes';
          button.disabled = false;
        }, 3000);

      }, 100);
    };

    // Ajouter le bouton à la page
    document.body.appendChild(button);
    console.log('[Scraper] Bouton créé et ajouté à la page');
  }

  // Créer le bouton au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDownloadButton);
  } else {
    createDownloadButton();
  }

  console.log('[Scraper] Script initialisé - Bouton de téléchargement prêt !');
})();
