/**
 * Vintex CRM - Background Service Worker
 * Coordonne la récupération des commandes Vinted et l'envoi au backend Vintex CRM
 */

// État global pour stocker les données pendant le processus de scan
let scanState = {
  orders: [],
  currentIndex: 0,
  isScanning: false,
  errors: []
};

/**
 * Écoute les messages provenant du popup et des content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Message reçu:', message);

  switch (message.type) {
    case 'START_SCAN_MY_ORDERS':
      handleStartScan(sendResponse);
      return true; // Permet une réponse asynchrone

    case 'MY_ORDERS_DATA':
      handleMyOrdersData(message.orders, sendResponse);
      return true;

    case 'GET_SCAN_STATUS':
      sendResponse({ status: scanState.isScanning ? 'scanning' : 'idle', progress: scanState.currentIndex, total: scanState.orders.length });
      return false;

    case 'SHIPPING_LABEL_FOUND':
      handleShippingLabelFound(message.conversationUrl, message.labelUrl);
      return false;

    case 'SHIPPING_LABEL_ERROR':
      handleShippingLabelError(message.conversationUrl, message.error);
      return false;

    case 'ENRICH_SALE_WITH_TRACKING':
      handleEnrichSaleWithTracking(message.inboxUrl, sendResponse);
      return true; // Permet une réponse asynchrone

    case 'TRIGGER_SYNC_FROM_CRM':
      handleTriggerSyncFromCRM(sendResponse);
      return true;

    case 'START_SCRAPING':
      handleFabStartScraping(message.limit || 10, sender.tab, sendResponse);
      return true;

    case 'SYNC_CRM':
      handleFabSyncCRM(sendResponse);
      return true;

    case 'OPEN_POPUP':
      // Non supporté depuis un content script en MV3, ignorer silencieusement
      return false;

    default:
      console.warn('[Background] Message non géré:', message.type);
      return false;
  }
});

/**
 * Démarre le processus de scan des commandes
 */
async function handleStartScan(sendResponse) {
  console.log('[Background] Démarrage du scan...');

  // Vérifier qu'un scan n'est pas déjà en cours
  if (scanState.isScanning) {
    sendResponse({ success: false, error: 'Un scan est déjà en cours' });
    return;
  }

  // Réinitialiser l'état
  scanState = {
    orders: [],
    currentIndex: 0,
    isScanning: true,
    errors: []
  };

  try {
    // Trouver l'onglet actif avec /my_orders
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];

    if (!currentTab.url.includes('vinted.fr/my_orders')) {
      throw new Error('Veuillez ouvrir la page https://www.vinted.fr/my_orders');
    }

    // Envoyer un message au content script de /my_orders pour lancer le scraping
    chrome.tabs.sendMessage(currentTab.id, { type: 'SCAN_MY_ORDERS_PAGE' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Background] Erreur lors de l\'envoi au content script:', chrome.runtime.lastError);
        scanState.isScanning = false;
        sendResponse({ success: false, error: 'Impossible de communiquer avec la page Vinted' });
      }
    });

    sendResponse({ success: true, message: 'Scan démarré...' });

  } catch (error) {
    console.error('[Background] Erreur lors du démarrage du scan:', error);
    scanState.isScanning = false;
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Traite les données des commandes reçues de /my_orders
 */
async function handleMyOrdersData(orders, sendResponse) {
  console.log(`[Background] ${orders.length} commande(s) reçue(s) de /my_orders`);

  scanState.orders = orders.map(order => ({
    ...order,
    shippingLabelUrl: null,
    fetchedAt: new Date().toISOString(),
    source: 'vinted'
  }));

  // Commencer à récupérer les bordereaux d'envoi
  await processNextOrder();

  sendResponse({ success: true });
}

/**
 * Traite la commande suivante (ouvre la page de conversation)
 */
async function processNextOrder() {
  if (scanState.currentIndex >= scanState.orders.length) {
    // Toutes les commandes ont été traitées
    await finalizeAndSendToBackend();
    return;
  }

  const order = scanState.orders[scanState.currentIndex];
  console.log(`[Background] Traitement de la commande ${scanState.currentIndex + 1}/${scanState.orders.length}`);

  try {
    // Ouvrir la page de conversation dans un nouvel onglet (en arrière-plan)
    const tab = await chrome.tabs.create({
      url: order.conversationUrl,
      active: false // Ne pas activer l'onglet
    });

    // Stocker l'ID de l'onglet pour pouvoir le fermer plus tard
    scanState.currentTabId = tab.id;

    // Attendre que la page soit chargée
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);

        // Envoyer un message au content script pour lancer la récupération du bordereau
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, { type: 'FETCH_SHIPPING_LABEL' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('[Background] Erreur lors de la communication avec le content script:', chrome.runtime.lastError);
              scanState.errors.push({
                order: order.title,
                error: 'Impossible de communiquer avec la page de conversation'
              });

              // Fermer l'onglet et passer à la suivante
              chrome.tabs.remove(tab.id).catch(() => {});
              scanState.currentIndex++;
              processNextOrder();
            }
            // Note: La réponse sera gérée par handleShippingLabelFound/Error
          });
        }, 2000); // Attendre 2 secondes pour laisser la page se charger complètement
      }
    });

  } catch (error) {
    console.error('[Background] Erreur lors de l\'ouverture de la conversation:', error);
    scanState.errors.push({
      order: order.title,
      error: error.message
    });
    scanState.currentIndex++;
    await processNextOrder();
  }
}


/**
 * Gère la réception de l'URL du bordereau d'envoi
 */
async function handleShippingLabelFound(conversationUrl, labelUrl) {
  console.log('[Background] Bordereau trouvé pour:', conversationUrl, '→', labelUrl);

  // Trouver la commande correspondante
  const order = scanState.orders.find(o => o.conversationUrl === conversationUrl);
  if (order) {
    order.shippingLabelUrl = labelUrl;
    console.log(`[Background] URL du bordereau enregistrée pour: ${order.title}`);
  }

  // Fermer l'onglet de conversation
  if (scanState.currentTabId) {
    await chrome.tabs.remove(scanState.currentTabId).catch(() => {});
  }

  // Passer à la commande suivante
  scanState.currentIndex++;
  await processNextOrder();
}

/**
 * Gère les erreurs lors de la récupération du bordereau
 */
async function handleShippingLabelError(conversationUrl, errorMessage) {
  console.error('[Background] Erreur lors de la récupération du bordereau pour:', conversationUrl, '→', errorMessage);

  // Trouver la commande correspondante
  const order = scanState.orders.find(o => o.conversationUrl === conversationUrl);
  if (order) {
    scanState.errors.push({
      order: order.title,
      error: errorMessage
    });
  }

  // Fermer l'onglet de conversation
  if (scanState.currentTabId) {
    await chrome.tabs.remove(scanState.currentTabId).catch(() => {});
  }

  // Passer à la commande suivante même en cas d'erreur
  scanState.currentIndex++;
  await processNextOrder();
}

/**
 * Enrichit une vente avec ses informations de suivi
 * Ouvre la page inbox dans un nouvel onglet, scrape, puis ferme l'onglet
 */
async function handleEnrichSaleWithTracking(inboxUrl, sendResponse) {
  console.log('[Background] Enrichissement de la vente:', inboxUrl);

  try {
    // Ouvrir la page inbox dans un nouvel onglet (en arrière-plan)
    const tab = await chrome.tabs.create({
      url: inboxUrl,
      active: false // Ne pas activer l'onglet
    });

    console.log('[Background] Onglet inbox ouvert:', tab.id);

    // Attendre que la page soit chargée
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);

        console.log('[Background] Page inbox chargée, scraping des infos de suivi...');

        // Envoyer un message au content script pour scraper les infos de suivi
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, { type: 'SCRAPE_TRACKING_INFO' }, (response) => {
            // Fermer l'onglet immédiatement
            chrome.tabs.remove(tab.id).catch(() => {});

            if (chrome.runtime.lastError) {
              console.error('[Background] Erreur:', chrome.runtime.lastError);
              sendResponse({
                success: false,
                error: chrome.runtime.lastError.message
              });
              return;
            }

            if (!response || !response.success) {
              console.warn('[Background] Échec du scraping');
              sendResponse({
                success: false,
                error: 'Échec du scraping'
              });
              return;
            }

            console.log('[Background] Infos de suivi récupérées:', response.data);

            // Renvoyer les données au content script my_orders
            sendResponse({
              success: true,
              data: response.data
            });
          });
        }, 1000); // Attendre 1 seconde pour le chargement complet
      }
    });

  } catch (error) {
    console.error('[Background] Erreur lors de l\'enrichissement:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Finalise le scan et génère le fichier JSON
 */
async function finalizeAndSendToBackend() {
  console.log('[Background] Scan terminé. Génération du fichier JSON...');

  try {
    // Préparer les données complètes
    const payload = {
      metadata: {
        totalOrders: scanState.orders.length,
        scannedAt: new Date().toISOString(),
        source: 'vinted',
        errors: scanState.errors.length > 0 ? scanState.errors : undefined
      },
      orders: scanState.orders
    };

    console.log('[Background] Données compilées:', payload);

    // Convertir en JSON formaté
    const jsonContent = JSON.stringify(payload, null, 2);

    // Créer un blob avec les données JSON
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Générer un nom de fichier avec la date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const filename = `vinted-orders-${dateStr}-${timeStr}.json`;

    // Télécharger le fichier
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true // Demander à l'utilisateur où sauvegarder
    });

    console.log(`[Background] Fichier JSON généré: ${filename}`);

    // Notifier le popup du succès
    chrome.runtime.sendMessage({
      type: 'SCAN_COMPLETE',
      success: true,
      ordersCount: scanState.orders.length,
      errors: scanState.errors,
      filename: filename,
      jsonData: payload // Envoyer les données au popup pour affichage
    });

    // Réinitialiser l'état
    scanState.isScanning = false;

    // Nettoyer l'URL du blob après un délai
    setTimeout(() => URL.revokeObjectURL(url), 10000);

  } catch (error) {
    console.error('[Background] Erreur lors de la génération du JSON:', error);

    // Notifier le popup de l'erreur
    chrome.runtime.sendMessage({
      type: 'SCAN_COMPLETE',
      success: false,
      error: error.message,
      ordersCount: scanState.orders.length,
      errors: scanState.errors
    });

    scanState.isScanning = false;
  }
}

/**
 * Déclenché par le bouton "Actualiser" du CRM
 * Ouvre (ou réutilise) un onglet vinted.fr/my_orders, scrape, puis sync vers l'API
 */
async function handleTriggerSyncFromCRM(sendResponse) {
  console.log('[Background] Sync déclenché depuis le CRM');

  try {
    const STORAGE_KEY = 'vintex_last_scan';
    const config = await chrome.storage.sync.get(['apiUrl', 'apiToken', 'vintedAccount']);
    const apiUrl = (config.apiUrl || 'http://localhost:3002').replace(/\/$/, '');
    const apiKey = config.apiToken || 'e65513ccb46dd85e64d1d630021831e63dd1ab87e516eb85cdec4baa674ec5bd';
    const vintedAccount = config.vintedAccount || '@mon_compte';

    // Chercher un onglet Vinted déjà ouvert
    const [existingTab] = await chrome.tabs.query({ url: 'https://www.vinted.fr/my_orders*' });

    let vintedTab;
    if (existingTab) {
      vintedTab = existingTab;
      await chrome.tabs.reload(existingTab.id);
      // Attendre le rechargement
      await new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === vintedTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        });
      });
    } else {
      // Ouvrir un nouvel onglet Vinted en arrière-plan
      vintedTab = await chrome.tabs.create({ url: 'https://www.vinted.fr/my_orders', active: false });
      await new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === vintedTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        });
      });
    }

    // Attendre que le content script soit prêt (DOM chargé)
    await new Promise(r => setTimeout(r, 2000));

    // Lancer le scraping
    const scrapeResponse = await new Promise((resolve) => {
      chrome.tabs.sendMessage(vintedTab.id, { type: 'START_SCRAPING' }, (res) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(res);
        }
      });
    });

    // Fermer l'onglet si on l'a ouvert nous-mêmes
    if (!existingTab) {
      chrome.tabs.remove(vintedTab.id).catch(() => {});
    }

    if (!scrapeResponse || !scrapeResponse.success) {
      sendResponse({ success: false, error: scrapeResponse?.error || 'Échec du scraping' });
      return;
    }

    const data = scrapeResponse.data;
    const ventesCount = scrapeResponse.ventesCount || 0;
    const achatsCount = scrapeResponse.achatsCount || 0;

    // Sauvegarder dans storage
    await chrome.storage.local.set({
      [STORAGE_KEY]: {
        data,
        ventesCount,
        achatsCount,
        savedAt: new Date().toISOString()
      }
    });

    // Préparer helpers
    const parsePrice = (str) => parseFloat((str || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const extractId = (url) => { if (!url) return `VTX-${Date.now()}`; const m = url.match(/\/(\d+)(?:\?|$|\/)/); return m ? `VT-${m[1]}` : `VTX-${Date.now()}`; };
    const mapVente = (s) => ({ 'Non traité': 'non_traite', 'En cours': 'en_cours', 'Validée': 'validée', 'Litige': 'litige', 'Annulée': 'annulée' }[s] || 'non_traite');
    const mapAchat = (s) => ({ 'En attente': 'en_attente', 'Expédié': 'expedie', 'Reçu': 'recu', 'En stock': 'en_stock', 'Revendu': 'revendu', 'Retourné': 'retourne', 'Litige': 'litige' }[s] || 'en_attente');
    const now = new Date().toISOString();
    const headers = { 'Content-Type': 'application/json', 'X-API-Key': apiKey };

    let created = 0, updated = 0;

    // Sync ventes
    const ventesRaw = data.filter(o => o.type_commande === 'vente');
    if (ventesRaw.length > 0) {
      const ventes = ventesRaw.map(o => {
        const salePrice = parsePrice(o.prix);
        const saleDate = o.date_vente ? new Date(o.date_vente).toISOString() : now;
        return { transactionNumber: extractId(o.inbox_url), articleName: o.nom || 'Article inconnu', brandName: 'Inconnu', purchasePrice: 0, salePrice, profit: salePrice, purchaseDate: saleDate, saleDate, status: mapVente(o.statut), customerName: 'Client Vinted', vintedAccount, trackingNumber: o.numero_suivi || null, carrier: o.transporteur || null };
      });
      const res = await fetch(`${apiUrl}/api/sync/ventes`, { method: 'POST', headers, body: JSON.stringify({ ventes }) });
      const result = await res.json();
      created += result.created || 0;
      updated += result.updated || 0;
    }

    // Sync achats
    const achatsRaw = data.filter(o => o.type_commande === 'achat');
    if (achatsRaw.length > 0) {
      const achats = achatsRaw.map(o => {
        const prixAchat = parsePrice(o.prix);
        return { numeroTransaction: extractId(o.inbox_url), nomArticle: o.nom || 'Article inconnu', marque: 'Inconnu', taille: 'Unique', prixAchat, fraisPort: 0, coutTotal: prixAchat, dateAchat: o.date_vente ? new Date(o.date_vente).toISOString() : now, compteVinted: vintedAccount, numeroSuivi: o.numero_suivi || null, statut: mapAchat(o.statut) };
      });
      const res = await fetch(`${apiUrl}/api/sync/achats`, { method: 'POST', headers, body: JSON.stringify({ achats }) });
      const result = await res.json();
      created += result.created || 0;
      updated += result.updated || 0;
    }

    sendResponse({ success: true, ventesCount, achatsCount, created, updated });

  } catch (err) {
    console.error('[Background] Erreur TRIGGER_SYNC_FROM_CRM:', err);
    sendResponse({ success: false, error: err.message });
  }
}

/**
 * FAB — Lance un scan depuis la page Vinted avec une limite
 */
async function handleFabStartScraping(limit, senderTab, sendResponse) {
  if (scanState.isScanning) {
    sendResponse({ success: false, error: 'Scan déjà en cours' });
    return;
  }

  try {
    // Utiliser l'onglet courant (celui qui a envoyé le message)
    const tabId = senderTab?.id;
    if (!tabId) {
      sendResponse({ success: false, error: 'Onglet non trouvé' });
      return;
    }

    chrome.tabs.sendMessage(tabId, { type: 'START_SCRAPING', limit }, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      sendResponse({ success: true });
    });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}

/**
 * FAB — Synchronise les données en storage vers le CRM
 */
async function handleFabSyncCRM(sendResponse) {
  try {
    const config = await chrome.storage.sync.get(['apiUrl', 'apiToken', 'vintedAccount']);
    const apiUrl = (config.apiUrl || 'http://localhost:3002').replace(/\/$/, '');
    const apiKey = config.apiToken || 'e65513ccb46dd85e64d1d630021831e63dd1ab87e516eb85cdec4baa674ec5bd';
    const vintedAccount = config.vintedAccount || '@mon_compte';

    const stored = await chrome.storage.local.get('vintex_last_scan');
    const lastScan = stored['vintex_last_scan'];

    if (!lastScan?.data?.length) {
      sendResponse({ success: false, error: 'Aucune donnée scannée. Lancez un scan d\'abord.' });
      return;
    }

    const data = lastScan.data;
    const headers = { 'Content-Type': 'application/json', 'X-API-Key': apiKey };
    const now = new Date().toISOString();
    const parsePrice = (str) => parseFloat((str || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const extractId = (url) => { if (!url) return `VTX-${Date.now()}`; const m = url.match(/\/(\d+)(?:\?|$|\/)/); return m ? `VT-${m[1]}` : `VTX-${Date.now()}`; };
    const mapVente = (s) => ({ 'Non traité': 'non_traite', 'En cours': 'en_cours', 'Validée': 'validée', 'Litige': 'litige', 'Annulée': 'annulée' }[s] || 'non_traite');
    const mapAchat = (s) => ({ 'En attente': 'en_attente', 'Expédié': 'expedie', 'Reçu': 'recu', 'En stock': 'en_stock', 'Revendu': 'revendu', 'Retourné': 'retourne', 'Litige': 'litige' }[s] || 'en_attente');

    let created = 0, updated = 0;

    const ventesRaw = data.filter(o => o.type_commande === 'vente');
    if (ventesRaw.length > 0) {
      const ventes = ventesRaw.map(o => {
        const salePrice = parsePrice(o.prix);
        const saleDate = o.date_vente ? new Date(o.date_vente).toISOString() : now;
        return { transactionNumber: extractId(o.inbox_url), articleName: o.nom || 'Article inconnu', brandName: 'Inconnu', purchasePrice: 0, salePrice, profit: salePrice, purchaseDate: saleDate, saleDate, status: mapVente(o.statut), customerName: 'Client Vinted', vintedAccount, trackingNumber: o.numero_suivi || null, carrier: o.transporteur || null };
      });
      const res = await fetch(`${apiUrl}/api/sync/ventes`, { method: 'POST', headers, body: JSON.stringify({ ventes }) });
      const result = await res.json();
      created += result.created || 0;
      updated += result.updated || 0;
    }

    const achatsRaw = data.filter(o => o.type_commande === 'achat');
    if (achatsRaw.length > 0) {
      const achats = achatsRaw.map(o => {
        const prixAchat = parsePrice(o.prix);
        return { numeroTransaction: extractId(o.inbox_url), nomArticle: o.nom || 'Article inconnu', marque: 'Inconnu', taille: 'Unique', prixAchat, fraisPort: 0, coutTotal: prixAchat, dateAchat: o.date_vente ? new Date(o.date_vente).toISOString() : now, compteVinted: vintedAccount, numeroSuivi: o.numero_suivi || null, statut: mapAchat(o.statut) };
      });
      const res = await fetch(`${apiUrl}/api/sync/achats`, { method: 'POST', headers, body: JSON.stringify({ achats }) });
      const result = await res.json();
      created += result.created || 0;
      updated += result.updated || 0;
    }

    sendResponse({ success: true, created, updated });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}

/**
 * Gestion de l'installation de l'extension
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] Extension Vintex CRM installée:', details.reason);

  if (details.reason === 'install') {
    console.log('[Background] Première installation - Extension prête à l\'emploi !');
  }
});

console.log('[Background] Service Worker Vintex CRM initialisé - Prêt à exporter vos commandes Vinted !');
