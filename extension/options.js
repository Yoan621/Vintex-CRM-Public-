/**
 * Vintex CRM - Options Script
 * Gère la configuration de l'extension (URL API, Token)
 */

const form = document.getElementById('configForm');
const apiUrlInput = document.getElementById('apiUrl');
const apiTokenInput = document.getElementById('apiToken');
const vintedAccountInput = document.getElementById('vintedAccount');
const testButton = document.getElementById('testButton');
const toggleTokenButton = document.getElementById('toggleToken');
const statusMessage = document.getElementById('statusMessage');

/**
 * Charge la configuration existante au chargement de la page
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Options] Chargement de la configuration...');

  try {
    const config = await chrome.storage.sync.get(['apiUrl', 'apiToken', 'vintedAccount']);

    if (config.apiUrl) {
      apiUrlInput.value = config.apiUrl;
    }

    if (config.apiToken) {
      apiTokenInput.value = config.apiToken;
    }

    if (config.vintedAccount && vintedAccountInput) {
      vintedAccountInput.value = config.vintedAccount;
    }

    console.log('[Options] Configuration chargée');
  } catch (error) {
    console.error('[Options] Erreur lors du chargement de la configuration:', error);
    showStatus('Erreur lors du chargement de la configuration', 'error');
  }
});

/**
 * Gère la soumission du formulaire
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiUrl = apiUrlInput.value.trim();
  const apiToken = apiTokenInput.value.trim();
  const vintedAccount = vintedAccountInput ? vintedAccountInput.value.trim() : '';

  // Validation
  if (!apiUrl) {
    showStatus('Veuillez entrer une URL d\'API', 'error');
    return;
  }

  // Vérifier que l'URL est valide
  try {
    new URL(apiUrl);
  } catch (error) {
    showStatus('URL invalide. Veuillez entrer une URL complète (ex: https://...)', 'error');
    return;
  }

  try {
    // Sauvegarder la configuration
    await chrome.storage.sync.set({
      apiUrl: apiUrl,
      apiToken: apiToken,
      vintedAccount: vintedAccount || '@mon_compte'
    });

    console.log('[Options] Configuration enregistrée');
    showStatus('✅ Configuration enregistrée avec succès !', 'success');

    // Masquer le message après 3 secondes
    setTimeout(() => {
      hideStatus();
    }, 3000);

  } catch (error) {
    console.error('[Options] Erreur lors de l\'enregistrement:', error);
    showStatus('❌ Erreur lors de l\'enregistrement de la configuration', 'error');
  }
});

/**
 * Teste la connexion à l'API
 */
testButton.addEventListener('click', async () => {
  const apiUrl = apiUrlInput.value.trim();
  const apiToken = apiTokenInput.value.trim();

  if (!apiUrl) {
    showStatus('Veuillez d\'abord entrer une URL d\'API', 'error');
    return;
  }

  // Vérifier que l'URL est valide
  try {
    new URL(apiUrl);
  } catch (error) {
    showStatus('URL invalide', 'error');
    return;
  }

  testButton.disabled = true;
  testButton.textContent = 'Test en cours...';

  try {
    // Envoyer une requête de test
    const headers = {
      'Content-Type': 'application/json'
    };

    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // Créer un payload de test
    const testPayload = {
      orders: [],
      test: true,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      showStatus('✅ Connexion réussie ! L\'API répond correctement.', 'success');
    } else {
      const errorText = await response.text();
      showStatus(`⚠️ L'API a répondu avec le code ${response.status}: ${errorText}`, 'error');
    }

  } catch (error) {
    console.error('[Options] Erreur lors du test de connexion:', error);

    if (error.message.includes('Failed to fetch')) {
      showStatus('❌ Impossible de se connecter à l\'API. Vérifiez que votre backend est démarré et accessible.', 'error');
    } else {
      showStatus('❌ Erreur: ' + error.message, 'error');
    }
  } finally {
    testButton.disabled = false;
    testButton.textContent = 'Tester la connexion';
  }
});

/**
 * Bascule l'affichage du token
 */
toggleTokenButton.addEventListener('click', () => {
  if (apiTokenInput.type === 'password') {
    apiTokenInput.type = 'text';
    toggleTokenButton.textContent = 'Masquer';
  } else {
    apiTokenInput.type = 'password';
    toggleTokenButton.textContent = 'Afficher';
  }
});

/**
 * Affiche un message de statut
 */
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

/**
 * Masque le message de statut
 */
function hideStatus() {
  statusMessage.style.display = 'none';
}

console.log('[Options] Script chargé');
