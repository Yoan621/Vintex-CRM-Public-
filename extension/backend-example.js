/**
 * Exemple de backend Node.js/Express pour recevoir les données de l'extension Vintex CRM
 *
 * Installation :
 *   npm install express cors dotenv
 *
 * Utilisation :
 *   node backend-example.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_TOKEN = process.env.API_TOKEN || 'votre-token-secret-ici';

// Middleware
app.use(cors()); // Permettre les requêtes cross-origin depuis l'extension
app.use(express.json());

// Middleware d'authentification (optionnel mais recommandé)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('⚠️  Aucun token fourni');
    // En mode développement, on peut laisser passer sans token
    return next();
  }

  if (token !== API_TOKEN) {
    console.log('❌ Token invalide:', token);
    return res.status(403).json({ error: 'Token invalide' });
  }

  console.log('✅ Token valide');
  next();
}

// Route principale pour recevoir les commandes Vinted
app.post('/api/vinted/orders', authenticateToken, async (req, res) => {
  try {
    console.log('\n📦 Réception de données Vinted...');
    console.log('Headers:', req.headers);

    const { orders, test } = req.body;

    // Si c'est une requête de test (depuis la page d'options)
    if (test) {
      console.log('🧪 Requête de test reçue');
      return res.json({
        success: true,
        message: 'Connexion réussie ! Votre backend Vintex CRM répond correctement.',
        timestamp: new Date().toISOString()
      });
    }

    // Validation des données
    if (!orders || !Array.isArray(orders)) {
      console.log('❌ Payload invalide');
      return res.status(400).json({
        success: false,
        error: 'Payload invalide : le champ "orders" doit être un tableau'
      });
    }

    console.log(`📊 ${orders.length} commande(s) reçue(s)`);

    // Traiter chaque commande
    const processedOrders = [];
    const errors = [];

    for (const order of orders) {
      try {
        console.log(`\n  📦 Traitement de la commande: ${order.title}`);
        console.log(`     - Prix: ${order.price}`);
        console.log(`     - Statut: ${order.status}`);
        console.log(`     - Bordereau: ${order.shippingLabelUrl ? '✅' : '❌'}`);

        // Ici, vous implémenteriez votre logique métier :
        // - Enregistrer en base de données
        // - Calculer les statistiques
        // - Télécharger le PDF du bordereau
        // - Mettre à jour le dashboard
        // etc.

        // Exemple : parser le prix
        const priceMatch = order.price.match(/[\d,]+/);
        const priceValue = priceMatch
          ? parseFloat(priceMatch[0].replace(',', '.'))
          : 0;

        const processedOrder = {
          orderId: order.orderId,
          title: order.title,
          price: priceValue,
          priceRaw: order.price,
          status: order.status,
          conversationUrl: order.conversationUrl,
          shippingLabelUrl: order.shippingLabelUrl,
          source: order.source,
          fetchedAt: new Date(order.fetchedAt),
          processedAt: new Date()
        };

        // TODO: Enregistrer en base de données
        // await db.orders.create(processedOrder);

        processedOrders.push(processedOrder);

        console.log(`     ✅ Commande traitée avec succès`);

      } catch (error) {
        console.error(`     ❌ Erreur lors du traitement de la commande:`, error);
        errors.push({
          order: order.title || order.orderId,
          error: error.message
        });
      }
    }

    // Réponse
    const response = {
      success: true,
      message: `${processedOrders.length} commande(s) importée(s) avec succès`,
      count: processedOrders.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    };

    console.log(`\n✅ Traitement terminé: ${processedOrders.length}/${orders.length} commande(s) importée(s)`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} erreur(s)`);
    }

    res.json(response);

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      message: error.message
    });
  }
});

// Route de santé (health check)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Vintex CRM API',
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.get('/api/vinted/test', (req, res) => {
  res.json({
    message: 'API Vintex CRM opérationnelle',
    endpoints: {
      orders: 'POST /api/vinted/orders',
      health: 'GET /health'
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('\n🚀 Serveur Vintex CRM démarré');
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Endpoint: http://localhost:${PORT}/api/vinted/orders`);
  console.log(`   Token: ${API_TOKEN ? '✅ configuré' : '⚠️  non configuré'}`);
  console.log('\n📋 Routes disponibles:');
  console.log(`   POST /api/vinted/orders  - Recevoir les commandes Vinted`);
  console.log(`   GET  /health             - Health check`);
  console.log(`   GET  /api/vinted/test    - Test de l'API`);
  console.log('\n⏳ En attente de requêtes...\n');
});

// Gestion des erreurs non gérées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Arrêt du serveur...');
  process.exit(0);
});
