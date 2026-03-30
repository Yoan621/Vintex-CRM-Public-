# Vintex CRM - Extension Chrome pour Vinted

Extension Chrome (Manifest V3) qui synchronise automatiquement vos ventes Vinted avec votre CRM maison **Vintex CRM**.

## 📋 Fonctionnalités

- 🔄 Scraping automatique de la page `/my_orders` de Vinted
- 📦 Récupération des informations complètes des commandes :
  - Titre de l'article
  - Prix de vente
  - Statut de la commande
  - URL de conversation
  - **Lien du bordereau d'envoi PDF**
- 🚀 Envoi automatique des données à votre backend Vintex CRM via API REST
- 🔐 Sécurisé : aucun identifiant Vinted stocké dans l'extension
- ⚙️ Configuration simple via la page d'options

## 🏗️ Architecture

### Structure des fichiers

```
Extension Vintex CRM/
├── manifest.json                    # Configuration Manifest V3
├── background.js                    # Service worker (orchestration)
├── content-my-orders.js            # Content script pour /my_orders
├── content-inbox.js                # Content script pour /inbox/*
├── content-inbox-injected.js       # Script injecté pour intercepter les requêtes
├── popup.html                      # Interface du popup
├── popup.js                        # Logique du popup
├── options.html                    # Page de configuration
├── options.js                      # Logique de configuration
├── icons/                          # Icônes de l'extension
│   ├── icon.svg                    # Icône source SVG
│   ├── icon16.png                  # 16x16 px
│   ├── icon32.png                  # 32x32 px
│   ├── icon48.png                  # 48x48 px
│   ├── icon128.png                 # 128x128 px
│   ├── generate_icons.py           # Script de génération (avec SVG)
│   ├── generate_simple_icons.py    # Script de génération (sans SVG)
│   └── README.md                   # Instructions pour les icônes
└── README.md                       # Ce fichier
```

### Flow de fonctionnement

1. **L'utilisateur** clique sur "Scanner mes commandes Vinted" dans le popup
2. **Popup** → envoie un message au **Service Worker**
3. **Service Worker** → demande au **content-my-orders.js** de scraper `/my_orders`
4. **content-my-orders.js** → extrait les infos des commandes et les renvoie au Service Worker
5. **Service Worker** → pour chaque commande :
   - Ouvre la page de conversation (`/inbox/...`) en arrière-plan
   - **content-inbox.js** → récupère l'URL du bordereau PDF
   - Ferme l'onglet et passe à la commande suivante
6. **Service Worker** → compile toutes les données et les envoie au backend Vintex CRM
7. **Backend** → traite les données et les enregistre en base

## 🚀 Installation

### Prérequis

- Google Chrome ou Chromium
- Python 3 (pour générer les icônes)
- Votre backend Vintex CRM doit être accessible

### Étapes

#### 1. Générer les icônes

Les icônes sont requises pour que l'extension fonctionne. Plusieurs options :

**Option A : Script Python simple (recommandé)**
```bash
cd "Extension Vintex CRM/icons"
pip install pillow
python3 generate_simple_icons.py
```

**Option B : Script avec SVG (meilleure qualité)**
```bash
cd "Extension Vintex CRM/icons"
pip install cairosvg pillow
python3 generate_icons.py
```

**Option C : Vos propres icônes**

Créez 4 fichiers PNG (16x16, 32x32, 48x48, 128x128) et placez-les dans le dossier `icons/`.

#### 2. Charger l'extension dans Chrome

1. Ouvrez Chrome et allez sur `chrome://extensions/`
2. Activez le **Mode développeur** (coin supérieur droit)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier `Extension Vintex CRM`
5. L'extension devrait apparaître dans votre barre d'extensions

#### 3. Configurer l'extension

1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Cliquez sur **"Configurer l'extension"**
3. Entrez :
   - **URL de l'API Backend** : par exemple `https://localhost:3001/api/vinted/orders`
   - **Token d'API** (optionnel) : votre token d'authentification
4. Cliquez sur **"Tester la connexion"** pour vérifier que votre backend répond
5. Cliquez sur **"Enregistrer la configuration"**

## 📖 Utilisation

### Synchroniser vos commandes Vinted

1. Ouvrez Chrome et allez sur **https://www.vinted.fr**
2. **Connectez-vous** à votre compte Vinted (connexion manuelle)
3. Allez sur **https://www.vinted.fr/my_orders**
4. Cliquez sur l'icône de l'extension Vintex CRM
5. Cliquez sur **"Scanner mes commandes Vinted"**
6. L'extension va :
   - Scanner toutes vos commandes visibles
   - Récupérer les bordereaux d'envoi
   - Envoyer les données à votre backend
7. Un message de succès s'affichera avec le nombre de commandes synchronisées

### Suivi de la progression

- Une barre de progression s'affiche pendant le scan
- Vous pouvez voir combien de commandes ont été traitées
- Les erreurs éventuelles sont listées à la fin du processus

## 🔧 Configuration du backend

### Format des données envoyées

L'extension envoie un payload JSON au format suivant :

```json
{
  "orders": [
    {
      "orderId": "19861078867",
      "title": "Bottes grise à bout carré sangles multiples grey Multi-Buckle Boots",
      "price": "40,50 €",
      "status": "Bordereau envoyé au vendeur",
      "conversationUrl": "https://www.vinted.fr/inbox/19861078867",
      "shippingLabelUrl": "https://svc-shipping-labels.s3.eu-central-1.amazonaws.com/...",
      "source": "vinted",
      "fetchedAt": "2025-12-25T20:48:00.000Z"
    }
  ]
}
```

### Endpoint API requis

Votre backend Vintex CRM doit exposer un endpoint qui :

- Accepte les requêtes **POST**
- Content-Type : `application/json`
- Authentification : Bearer token (optionnel)

**Exemple avec Node.js + Express :**

```javascript
app.post('/api/vinted/orders', authenticateToken, async (req, res) => {
  try {
    const { orders } = req.body;

    // Valider les données
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Traiter les commandes
    for (const order of orders) {
      // Enregistrer en base de données
      await db.orders.create({
        orderId: order.orderId,
        title: order.title,
        price: parseFloat(order.price.replace(',', '.').replace('€', '').trim()),
        status: order.status,
        conversationUrl: order.conversationUrl,
        shippingLabelUrl: order.shippingLabelUrl,
        source: order.source,
        fetchedAt: new Date(order.fetchedAt)
      });
    }

    res.json({
      success: true,
      message: `${orders.length} commande(s) importée(s)`,
      count: orders.length
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 🔐 Sécurité

### Bonnes pratiques

- ✅ **Ne jamais** hardcoder vos identifiants Vinted dans l'extension
- ✅ L'extension ne stocke **aucune** information sensible
- ✅ Utilisez HTTPS pour votre backend en production
- ✅ Implémentez un token d'authentification côté backend
- ✅ Limitez l'accès à votre API backend (CORS, IP whitelisting)
- ✅ Cette extension est pour **usage personnel uniquement**

### Permissions Chrome

L'extension demande les permissions suivantes :

- `activeTab` : pour interagir avec l'onglet actif
- `scripting` : pour injecter des scripts dans les pages Vinted
- `tabs` : pour ouvrir/fermer les pages de conversation
- `storage` : pour sauvegarder la configuration (URL API, token)
- `host_permissions` : accès à `vinted.fr` et au CDN des bordereaux

## 🐛 Dépannage

### L'extension ne se charge pas

- Vérifiez que les icônes PNG sont bien générées dans `icons/`
- Vérifiez qu'il n'y a pas d'erreur de syntaxe dans les fichiers JS
- Consultez la console dans `chrome://extensions/` (mode développeur)

### Le scan ne démarre pas

- Vérifiez que vous êtes bien sur `https://www.vinted.fr/my_orders`
- Vérifiez que vous êtes connecté à votre compte Vinted
- Vérifiez que l'URL de l'API est configurée dans les options

### Les bordereaux ne sont pas récupérés

- Vérifiez que le bouton "Télécharger" est bien visible sur la page de conversation
- Consultez la console du navigateur (F12) pour voir les logs
- Certains statuts de commande peuvent ne pas avoir de bordereau disponible

### Erreur d'envoi au backend

- Vérifiez que votre backend Vintex CRM est démarré
- Testez l'URL avec le bouton "Tester la connexion" dans les options
- Vérifiez les logs de votre backend
- Assurez-vous que CORS est configuré si nécessaire

## 📝 Logs et débogage

Pour activer les logs détaillés :

1. Ouvrez `chrome://extensions/`
2. Cliquez sur "Détails" de l'extension Vintex CRM
3. Cliquez sur "Inspecter les vues : service worker"
4. La console des DevTools s'ouvre avec tous les logs du background script

Pour voir les logs des content scripts :
1. Allez sur `vinted.fr/my_orders` ou `/inbox/...`
2. Ouvrez la console (F12)
3. Recherchez les logs préfixés par `[Content My Orders]` ou `[Content Inbox]`

## 🚧 Limitations connues

- L'extension ne peut scanner que les commandes **visibles** sur `/my_orders` (pas de pagination automatique)
- Certaines commandes peuvent ne pas avoir de bordereau disponible selon leur statut
- L'interception du lien du bordereau peut prendre quelques secondes par commande
- L'extension nécessite que vous soyez **connecté** à Vinted dans Chrome

## 🔄 Améliorations futures possibles

- [ ] Support de la pagination sur `/my_orders`
- [ ] Synchronisation automatique à intervalles réguliers
- [ ] Support multi-comptes Vinted
- [ ] Export des données en CSV/JSON
- [ ] Notifications desktop
- [ ] Statistiques en temps réel dans le popup

## 📄 Licence

Cette extension est développée pour un **usage personnel et interne** dans le cadre du CRM Vintex.

## 🤝 Support

Si vous rencontrez des problèmes :

1. Consultez la section "Dépannage" ci-dessus
2. Vérifiez les logs dans la console Chrome
3. Vérifiez que votre backend répond correctement
4. Assurez-vous d'être sur les bonnes pages Vinted

---

**Développé pour Vintex CRM** | Extension Chrome Manifest V3
