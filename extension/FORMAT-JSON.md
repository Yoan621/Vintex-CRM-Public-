# 📄 Format du fichier JSON généré

L'extension Vintex CRM génère un fichier JSON contenant toutes vos commandes Vinted avec leurs informations complètes.

## 📦 Structure du fichier

Le fichier JSON téléchargé a la structure suivante :

```json
{
  "metadata": {
    "totalOrders": 3,
    "scannedAt": "2025-12-25T20:48:00.000Z",
    "source": "vinted",
    "errors": [...]  // Optionnel : liste des erreurs rencontrées
  },
  "orders": [
    // Liste des commandes
  ]
}
```

## 🔍 Détails des champs

### Metadata

| Champ | Type | Description |
|-------|------|-------------|
| `totalOrders` | number | Nombre total de commandes extraites |
| `scannedAt` | string (ISO 8601) | Date et heure du scan |
| `source` | string | Toujours "vinted" |
| `errors` | array | Liste des erreurs rencontrées (optionnel) |

### Orders (chaque commande)

| Champ | Type | Description |
|-------|------|-------------|
| `orderId` | string | ID unique de la commande (extrait de l'URL inbox) |
| `title` | string | Titre complet de l'article vendu |
| `price` | string | Prix de vente avec devise (ex: "40,50 €") |
| `status` | string | Statut de la commande (ex: "Bordereau envoyé au vendeur") |
| `conversationUrl` | string | URL de la page de conversation |
| `shippingLabelUrl` | string\|null | URL du bordereau d'envoi PDF (null si non disponible) |
| `fetchedAt` | string (ISO 8601) | Date et heure de récupération de la commande |
| `source` | string | Toujours "vinted" |

## 📝 Exemple complet

Voir le fichier [exemple-output.json](exemple-output.json) pour un exemple concret avec 3 commandes.

## 🔄 Traitement du JSON

### Importer dans une base de données

**Exemple avec Node.js + PostgreSQL :**

```javascript
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('vinted-orders-2025-12-25.json'));

for (const order of data.orders) {
  await db.query(`
    INSERT INTO vinted_orders (
      order_id, title, price, status,
      conversation_url, shipping_label_url,
      fetched_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (order_id) DO UPDATE SET
      status = EXCLUDED.status,
      shipping_label_url = EXCLUDED.shipping_label_url
  `, [
    order.orderId,
    order.title,
    parseFloat(order.price.replace(',', '.').replace(' €', '')),
    order.status,
    order.conversationUrl,
    order.shippingLabelUrl,
    order.fetchedAt
  ]);
}
```

**Exemple avec Python + SQLite :**

```python
import json
import sqlite3
from datetime import datetime

# Charger le JSON
with open('vinted-orders-2025-12-25.json', 'r') as f:
    data = json.load(f)

# Connexion à la base
conn = sqlite3.connect('vintex.db')
cursor = conn.cursor()

# Créer la table si elle n'existe pas
cursor.execute('''
    CREATE TABLE IF NOT EXISTS vinted_orders (
        order_id TEXT PRIMARY KEY,
        title TEXT,
        price REAL,
        status TEXT,
        conversation_url TEXT,
        shipping_label_url TEXT,
        fetched_at TEXT
    )
''')

# Insérer les données
for order in data['orders']:
    price = float(order['price'].replace(',', '.').replace(' €', ''))

    cursor.execute('''
        INSERT OR REPLACE INTO vinted_orders
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        order['orderId'],
        order['title'],
        price,
        order['status'],
        order['conversationUrl'],
        order['shippingLabelUrl'],
        order['fetchedAt']
    ))

conn.commit()
conn.close()
```

### Télécharger les bordereaux PDF

**Exemple avec Node.js :**

```javascript
const fs = require('fs');
const https = require('https');

const data = JSON.parse(fs.readFileSync('vinted-orders-2025-12-25.json'));

for (const order of data.orders) {
  if (order.shippingLabelUrl) {
    const filename = `bordereaux/${order.orderId}.pdf`;
    const file = fs.createWriteStream(filename);

    https.get(order.shippingLabelUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ ${filename} téléchargé`);
      });
    });
  }
}
```

### Calculer des statistiques

**Exemple avec JavaScript :**

```javascript
const data = JSON.parse(fs.readFileSync('vinted-orders-2025-12-25.json'));

// Prix total
const totalRevenue = data.orders.reduce((sum, order) => {
  const price = parseFloat(order.price.replace(',', '.').replace(' €', ''));
  return sum + price;
}, 0);

console.log(`Chiffre d'affaires: ${totalRevenue.toFixed(2)} €`);

// Prix moyen
const avgPrice = totalRevenue / data.orders.length;
console.log(`Prix moyen: ${avgPrice.toFixed(2)} €`);

// Commandes avec bordereau
const withLabel = data.orders.filter(o => o.shippingLabelUrl).length;
console.log(`Commandes avec bordereau: ${withLabel}/${data.orders.length}`);

// Grouper par statut
const byStatus = data.orders.reduce((acc, order) => {
  acc[order.status] = (acc[order.status] || 0) + 1;
  return acc;
}, {});

console.log('Par statut:', byStatus);
```

## 💡 Conseils

1. **Sauvegardez régulièrement** : Exportez vos commandes toutes les semaines
2. **Versionning** : Gardez les fichiers JSON datés pour historique
3. **Validation** : Vérifiez que `metadata.totalOrders` correspond au nombre d'éléments dans `orders`
4. **Bordereaux** : Les URLs de bordereau expirent après ~7 jours, téléchargez-les rapidement
5. **Parsing des prix** : Convertissez "40,50 €" en nombre : `parseFloat(price.replace(',', '.').replace(' €', ''))`

## 🔗 Intégration avec Excel/Google Sheets

Vous pouvez aussi convertir le JSON en CSV pour l'ouvrir dans Excel :

**Script de conversion JSON → CSV :**

```javascript
const data = JSON.parse(fs.readFileSync('vinted-orders-2025-12-25.json'));
const csv = ['Order ID,Title,Price,Status,Shipping Label'];

data.orders.forEach(order => {
  const price = order.price.replace(' €', '').replace(',', '.');
  csv.push([
    order.orderId,
    `"${order.title.replace(/"/g, '""')}"`,
    price,
    `"${order.status}"`,
    order.shippingLabelUrl ? 'Oui' : 'Non'
  ].join(','));
});

fs.writeFileSync('vinted-orders.csv', csv.join('\n'));
```

---

**Questions ?** Consultez le [README.md](README.md) complet ou le [QUICKSTART.md](QUICKSTART.md).
