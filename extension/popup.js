/**
 * Vintex CRM - Popup Script
 * Gère l'interface utilisateur et le téléchargement CSV
 */

const scanButton10 = document.getElementById('scanButton10');
const scanButton50 = document.getElementById('scanButton50');
const scanButton100 = document.getElementById('scanButton100');
const downloadCsvButton = document.getElementById('downloadCsvButton');
const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('results');
const progressDiv = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

/**
 * État de l'interface
 */
let isScanning = false;
let scrapedData = null; // Stocke les données scrapées

const STORAGE_KEY = 'vintex_last_scan';

/**
 * Sauvegarde les données scrapées dans chrome.storage.local
 */
async function saveToHistory(data, counts) {
  await chrome.storage.local.set({
    [STORAGE_KEY]: {
      data,
      ventesCount: counts.ventesCount,
      achatsCount: counts.achatsCount,
      savedAt: new Date().toISOString()
    }
  });
}

/**
 * Charge les données sauvegardées depuis chrome.storage.local
 */
async function loadFromHistory() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}

/**
 * Initialisation
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Popup] Initialisation...');

  // Vérifier qu'on est sur la bonne page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const onVintedPage = tab.url && tab.url.includes('vinted.fr/my_orders');

  if (!onVintedPage) {
    showStatus('⚠️ Ouvrez vinted.fr/my_orders pour scanner. Les données précédentes sont disponibles ci-dessous.', 'warning');
    [scanButton10, scanButton50, scanButton100].forEach(b => b.disabled = true);
  } else {
    showStatus('Prêt à scanner vos ventes et achats Vinted', '');
  }

  // Restaurer les données du dernier scan
  const saved = await loadFromHistory();
  if (saved && saved.data && saved.data.length > 0) {
    scrapedData = saved.data;
    const dateStr = new Date(saved.savedAt).toLocaleString('fr-FR');
    handleScanSuccess(saved.data, saved.data.length, {
      ventesCount: saved.ventesCount,
      achatsCount: saved.achatsCount
    }, `Dernier scan : ${dateStr}`);
  }

  // Événements
  scanButton10.addEventListener('click', () => handleScan(10));
  scanButton50.addEventListener('click', () => handleScan(50));
  scanButton100.addEventListener('click', () => handleScan(100));
  downloadCsvButton.addEventListener('click', handleDownloadCsv);
  const syncAchatsBtn = document.getElementById('syncAchatsButton');
  if (syncAchatsBtn) syncAchatsBtn.addEventListener('click', syncAchats);
  const clearBtn = document.getElementById('clearHistoryButton');
  if (clearBtn) clearBtn.addEventListener('click', async () => {
    await chrome.storage.local.remove(STORAGE_KEY);
    scrapedData = null;
    downloadCsvButton.style.display = 'none';
    const syncBtn = document.getElementById('syncCrmButton');
    if (syncBtn) syncBtn.style.display = 'none';
    const syncABtn = document.getElementById('syncAchatsButton');
    if (syncABtn) syncABtn.style.display = 'none';
    clearBtn.style.display = 'none';
    resultsDiv.classList.add('hidden');
    showStatus('🗑️ Historique effacé.', '');
  });
});

/**
 * Gère le clic sur les boutons de scan
 */
async function handleScan(limit) {
  if (isScanning) return;

  console.log(`[Popup] Démarrage du scan (limit: ${limit})...`);

  isScanning = true;
  [scanButton10, scanButton50, scanButton100].forEach(b => b.disabled = true);
  downloadCsvButton.style.display = 'none';
  resultsDiv.classList.add('hidden');
  scrapedData = null;

  // Afficher le statut
  showStatus(`<span class="spinner"></span> Scan des ${limit} derniers articles en cours...`, '');
  progressDiv.style.display = 'block';
  updateProgress(0, 1);

  try {
    // Récupérer l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes('vinted.fr/my_orders')) {
      throw new Error('Vous devez être sur la page my_orders de Vinted');
    }

    // Envoyer un message au content script pour lancer le scraping
    chrome.tabs.sendMessage(tab.id, { type: 'START_SCRAPING', limit }, async (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Popup] Erreur:', chrome.runtime.lastError);
        showStatus('❌ Erreur: Impossible de communiquer avec la page. Rechargez la page et réessayez.', 'error');
        resetUI();
        return;
      }

      if (!response) {
        showStatus('❌ Erreur: Aucune réponse du content script', 'error');
        resetUI();
        return;
      }

      if (!response.success) {
        showStatus('❌ Erreur: ' + response.error, 'error');
        resetUI();
        return;
      }

      // Succès !
      console.log('[Popup] Données reçues:', response.data);
      scrapedData = response.data;

      // Sauvegarder dans l'historique local
      await saveToHistory(response.data, {
        ventesCount: response.ventesCount || 0,
        achatsCount: response.achatsCount || 0
      });

      handleScanSuccess(response.data, response.count, response);
    });

  } catch (error) {
    console.error('[Popup] Erreur:', error);
    showStatus('❌ ' + error.message, 'error');
    resetUI();
  }
}

/**
 * Gère le succès du scan
 */
async function handleScanSuccess(data, count, response, statusLabel) {
  console.log('[Popup] Scan terminé avec succès');

  progressDiv.style.display = 'none';
  const label = statusLabel || `✅ Scan terminé ! ${count} commande(s) trouvée(s)`;
  showStatus(label, 'success');

  // Compter ventes et achats
  const ventesCount = response.ventesCount || 0;
  const achatsCount = response.achatsCount || 0;

  // Afficher les résultats
  let resultsHTML = `
    <h3>📋 Résultats du scan</h3>
    <p><strong>${count}</strong> commande(s) extraite(s)</p>
    <div style="margin-top: 10px; font-size: 12px; opacity: 0.9;">
      <div>🟢 Ventes : <strong>${ventesCount}</strong></div>
      <div>🔵 Achats : <strong>${achatsCount}</strong></div>
    </div>
  `;

  // Afficher un aperçu des données
  if (data && data.length > 0) {
    resultsHTML += `
      <div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 6px; font-size: 11px;">
        <strong>Aperçu:</strong>
        <div style="margin-top: 5px; max-height: 150px; overflow-y: auto;">
    `;

    // Afficher les 3 premières commandes
    const preview = data.slice(0, 3);
    preview.forEach((order, idx) => {
      const emoji = order.type_commande === 'vente' ? '🟢' : '🔵';
      resultsHTML += `
        <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.5); border-radius: 4px;">
          <div><strong>${emoji} ${idx + 1}.</strong> ${order.nom.substring(0, 35)}${order.nom.length > 35 ? '...' : ''}</div>
          <div style="opacity: 0.8; font-size: 10px;">${order.type_commande} | ${order.prix} | ${order.statut}</div>
        </div>
      `;
    });

    if (data.length > 3) {
      resultsHTML += `
        <div style="margin-top: 5px; opacity: 0.7;">
          ... et ${data.length - 3} autre(s) commande(s)
        </div>
      `;
    }

    resultsHTML += `
        </div>
      </div>
    `;
  }

  resultsDiv.innerHTML = resultsHTML;
  resultsDiv.classList.remove('hidden');

  // Activer le bouton de téléchargement CSV
  downloadCsvButton.style.display = 'block';
  downloadCsvButton.disabled = false;

  // Bouton sync CRM
  const syncButton = document.getElementById('syncCrmButton');
  if (syncButton) {
    syncButton.style.display = 'block';
    syncButton.disabled = false;
    syncButton.onclick = () => syncWithCRM(data);
  }

  // Bouton sync achats uniquement (visible si des achats existent)
  const syncAchatsBtn = document.getElementById('syncAchatsButton');
  if (syncAchatsBtn && achatsCount > 0) {
    syncAchatsBtn.style.display = 'block';
    syncAchatsBtn.disabled = false;
  }

  const clearBtn = document.getElementById('clearHistoryButton');
  if (clearBtn) clearBtn.style.display = 'block';

  isScanning = false;
  [scanButton10, scanButton50, scanButton100].forEach(b => b.disabled = false);
}

/**
 * Parse un prix Vinted "45,00 €" en float
 */
function parseVintedPrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

/**
 * Extrait un ID de transaction depuis une URL Vinted
 */
function extractTransactionId(url) {
  if (!url) return `VTX-${Date.now()}`;
  const match = url.match(/\/(\d+)(?:\?|$|\/)/);
  return match ? `VT-${match[1]}` : `VTX-${Date.now()}`;
}

/**
 * Mappe un statut Vinted vers le format API ventes
 */
function mapVenteStatus(statut) {
  const map = {
    'Non traité': 'non_traite',
    'En cours': 'en_cours',
    'Validée': 'validée',
    'Litige': 'litige',
    'Annulée': 'annulée'
  };
  return map[statut] || 'non_traite';
}

/**
 * Mappe un statut Vinted vers le format API achats
 */
function mapAchatStatus(statut) {
  const map = {
    'En attente': 'en_attente',
    'Expédié': 'expedie',
    'Reçu': 'recu',
    'En stock': 'en_stock',
    'Revendu': 'revendu',
    'Retourné': 'retourne',
    'Litige': 'litige'
  };
  return map[statut] || 'en_attente';
}

/**
 * Synchronise les données scrapées avec le CRM Vintex via l'API
 */
async function syncWithCRM(data) {
  const syncButton = document.getElementById('syncCrmButton');
  if (syncButton) { syncButton.disabled = true; syncButton.textContent = '⏳ Sync en cours...'; }

  showStatus('<span class="spinner"></span> Synchronisation avec le CRM...', '');

  try {
    const config = await chrome.storage.sync.get(['apiUrl', 'apiToken', 'vintedAccount']);
    const apiUrl = (config.apiUrl || 'http://localhost:3002').replace(/\/$/, '');
    const apiKey = config.apiToken || 'e65513ccb46dd85e64d1d630021831e63dd1ab87e516eb85cdec4baa674ec5bd';
    const vintedAccount = config.vintedAccount || '@mon_compte';

    const now = new Date().toISOString();
    const headers = { 'Content-Type': 'application/json', 'X-API-Key': apiKey };

    // --- VENTES ---
    const ventesRaw = data.filter(o => o.type_commande === 'vente');
    let ventesResult = { created: 0, updated: 0, errors: [] };

    if (ventesRaw.length > 0) {
      const ventes = ventesRaw.map(o => {
        const salePrice = parseVintedPrice(o.prix);
        const saleDate = o.date_vente ? new Date(o.date_vente).toISOString() : now;
        return {
          transactionNumber: extractTransactionId(o.inbox_url),
          articleName: o.nom || 'Article inconnu',
          brandName: 'Inconnu',
          purchasePrice: 0,
          salePrice,
          profit: salePrice,
          purchaseDate: saleDate,
          saleDate,
          status: mapVenteStatus(o.statut),
          customerName: 'Client Vinted',
          vintedAccount,
          trackingNumber: o.numero_suivi || null,
          carrier: o.transporteur || null
        };
      });

      const res = await fetch(`${apiUrl}/api/sync/ventes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ventes })
      });
      ventesResult = await res.json();
    }

    // --- ACHATS ---
    const achatsRaw = data.filter(o => o.type_commande === 'achat');
    let achatsResult = { created: 0, updated: 0, errors: [] };

    if (achatsRaw.length > 0) {
      const achats = achatsRaw.map(o => {
        const prixAchat = parseVintedPrice(o.prix);
        return {
          numeroTransaction: extractTransactionId(o.inbox_url),
          nomArticle: o.nom || 'Article inconnu',
          marque: 'Inconnu',
          taille: 'Unique',
          prixAchat,
          fraisPort: 0,
          coutTotal: prixAchat,
          dateAchat: o.date_vente ? new Date(o.date_vente).toISOString() : now,
          compteVinted: vintedAccount,
          numeroSuivi: o.numero_suivi || null,
          statut: mapAchatStatus(o.statut)
        };
      });

      const res = await fetch(`${apiUrl}/api/sync/achats`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ achats })
      });
      achatsResult = await res.json();
    }

    const totalCreated = (ventesResult.created || 0) + (achatsResult.created || 0);
    const totalUpdated = (ventesResult.updated || 0) + (achatsResult.updated || 0);
    showStatus(
      `✅ Sync CRM terminé ! +${totalCreated} créé(s), ${totalUpdated} mis à jour`,
      'success'
    );

  } catch (err) {
    console.error('[Popup] Erreur sync CRM:', err);
    showStatus('❌ Erreur sync : ' + err.message + ' — vérifiez que le CRM tourne sur localhost:3002', 'error');
  }

  if (syncButton) { syncButton.disabled = false; syncButton.textContent = '🔄 Sync CRM'; }
}

/**
 * Synchronise uniquement les achats vers le CRM Vintex
 * Endpoint : http://localhost:3002/api/sync/achats
 */
async function syncAchats() {
  if (!scrapedData || scrapedData.length === 0) {
    showStatus('❌ Aucune donnée. Faites d\'abord un scan.', 'error');
    return;
  }

  const achatsRaw = scrapedData.filter(o => o.type_commande === 'achat');
  if (achatsRaw.length === 0) {
    showStatus('ℹ️ Aucun achat trouvé dans les données scannées.', '');
    return;
  }

  const syncAchatsBtn = document.getElementById('syncAchatsButton');
  if (syncAchatsBtn) { syncAchatsBtn.disabled = true; syncAchatsBtn.textContent = '⏳ Sync achats...'; }
  showStatus('<span class="spinner"></span> Synchronisation des achats...', '');

  try {
    const API_KEY = 'e65513ccb46dd85e64d1d630021831e63dd1ab87e516eb85cdec4baa674ec5bd';
    const API_URL = 'http://localhost:3002/api/sync/achats';

    const config = await chrome.storage.sync.get(['vintedAccount']);
    const compteVinted = config.vintedAccount || '@mon_compte';
    const now = new Date().toISOString();

    const achats = achatsRaw.map(o => {
      const prixAchat = parseVintedPrice(o.prix);
      return {
        numeroTransaction: extractTransactionId(o.inbox_url),
        nomArticle: o.nom || 'Article inconnu',
        marque: 'Inconnu',
        taille: 'Unique',
        prixAchat,
        fraisPort: 0,
        coutTotal: prixAchat,
        dateAchat: o.date_vente ? new Date(o.date_vente).toISOString() : now,
        compteVinted,
        statut: mapAchatStatus(o.statut)
      };
    });

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      body: JSON.stringify({ achats })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    showStatus(
      `✅ Achats synchronisés : +${result.created || 0} créé(s), ${result.updated || 0} mis à jour`,
      'success'
    );
  } catch (err) {
    console.error('[Popup] Erreur syncAchats:', err);
    showStatus('❌ Erreur sync achats : ' + err.message, 'error');
  }

  if (syncAchatsBtn) { syncAchatsBtn.disabled = false; syncAchatsBtn.textContent = '🔵 Sync Achats CRM'; }
}

/**
 * Réinitialise l'UI après une erreur
 */
function resetUI() {
  isScanning = false;
  [scanButton10, scanButton50, scanButton100].forEach(b => b.disabled = false);
  progressDiv.style.display = 'none';
  downloadCsvButton.style.display = 'none';
}

/**
 * Gère le téléchargement CSV
 */
function handleDownloadCsv() {
  if (!scrapedData || scrapedData.length === 0) {
    showStatus('❌ Aucune donnée à télécharger', 'error');
    return;
  }

  console.log('[Popup] Génération du CSV...');

  try {
    // Convertir les données en CSV
    const csv = convertToCSV(scrapedData);

    // Générer le nom du fichier
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `vintex_vinted_commandes_${dateStr}.csv`;

    // Télécharger le fichier
    downloadFile(csv, filename, 'text/csv');

    showStatus(`✅ Fichier CSV téléchargé : ${filename}`, 'success');

  } catch (error) {
    console.error('[Popup] Erreur lors du téléchargement:', error);
    showStatus('❌ Erreur lors de la génération du CSV', 'error');
  }
}

/**
 * Convertit les données en CSV
 */
function convertToCSV(data) {
  if (data.length === 0) {
    return 'type_commande,nom,prix,statut,inbox_url,date_vente,numero_suivi,transporteur\n';
  }

  // En-têtes CSV
  const headers = ['type_commande', 'nom', 'prix', 'statut', 'inbox_url', 'date_vente', 'numero_suivi', 'transporteur'];
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
 * Télécharge un fichier
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Utiliser l'API chrome.downloads pour télécharger
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  }, (downloadId) => {
    console.log('[Popup] Téléchargement démarré:', downloadId);

    // Nettoyer l'URL après un délai
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
}

/**
 * Met à jour la barre de progression
 */
function updateProgress(current, total) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  progressFill.style.width = percentage + '%';
  progressText.textContent = `Scraping en cours...`;
}

/**
 * Affiche un message de statut
 */
function showStatus(message, type = '') {
  statusDiv.innerHTML = message;
  statusDiv.className = 'status';
  if (type) {
    statusDiv.classList.add(type);
  }
  statusDiv.classList.remove('hidden');
}

// ── Gestion des onglets ──────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ── Onglet Paramètres ────────────────────────────────────────────────────────
const settingsApiUrl      = document.getElementById('settingsApiUrl');
const settingsApiToken    = document.getElementById('settingsApiToken');
const settingsVintedAcct  = document.getElementById('settingsVintedAccount');
const saveSettingsBtn     = document.getElementById('saveSettingsBtn');
const testConnectionBtn   = document.getElementById('testConnectionBtn');
const toggleApiToken      = document.getElementById('toggleApiToken');
const settingsStatusEl    = document.getElementById('settingsStatus');

// Charger les valeurs sauvegardées au démarrage
chrome.storage.sync.get(['apiUrl', 'apiToken', 'vintedAccount'], (config) => {
  if (config.apiUrl)         settingsApiUrl.value     = config.apiUrl;
  if (config.apiToken)       settingsApiToken.value   = config.apiToken;
  if (config.vintedAccount)  settingsVintedAcct.value = config.vintedAccount;
});

// Afficher / masquer le token
toggleApiToken.addEventListener('click', () => {
  const isHidden = settingsApiToken.type === 'password';
  settingsApiToken.type = isHidden ? 'text' : 'password';
  toggleApiToken.textContent = isHidden ? 'Cacher' : 'Voir';
});

// Enregistrer
saveSettingsBtn.addEventListener('click', async () => {
  const apiUrl        = settingsApiUrl.value.trim();
  const apiToken      = settingsApiToken.value.trim();
  const vintedAccount = settingsVintedAcct.value.trim();

  if (!apiUrl) { showSettingsStatus('URL du CRM requise', false); return; }

  await chrome.storage.sync.set({ apiUrl, apiToken, vintedAccount: vintedAccount || '@mon_compte' });
  showSettingsStatus('✅ Configuration enregistrée !', true);
});

// Tester la connexion
testConnectionBtn.addEventListener('click', async () => {
  const apiUrl   = settingsApiUrl.value.trim();
  const apiToken = settingsApiToken.value.trim();
  if (!apiUrl) { showSettingsStatus('Entrez d\'abord une URL', false); return; }

  testConnectionBtn.disabled = true;
  testConnectionBtn.textContent = '⏳ Test...';
  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/sync/ventes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiToken },
      body: JSON.stringify({ ventes: [] })
    });
    const data = await res.json();
    if (res.ok && data.success !== false) {
      showSettingsStatus('✅ Connexion OK !', true);
    } else {
      showSettingsStatus(`❌ Réponse ${res.status}`, false);
    }
  } catch (e) {
    showSettingsStatus('❌ Impossible de joindre le CRM', false);
  }
  testConnectionBtn.disabled = false;
  testConnectionBtn.textContent = '🔌 Tester la connexion';
});

function showSettingsStatus(msg, ok) {
  settingsStatusEl.textContent = msg;
  settingsStatusEl.className = 'settings-status ' + (ok ? 'ok' : 'error');
  setTimeout(() => { settingsStatusEl.className = 'settings-status'; }, 4000);
}

console.log('[Popup] Script chargé');
