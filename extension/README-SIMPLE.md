# 📦 Vintex CRM - Export Vinted vers JSON

Extension Chrome ultra-simple pour **exporter vos ventes Vinted en JSON**.

## ⚡ Installation (2 minutes)

### 1. Charger l'extension

1. Ouvrez Chrome → `chrome://extensions/`
2. Activez le **Mode développeur** (coin supérieur droit)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier **`Extension Vintex CRM`**

✅ C'est tout ! Aucune configuration nécessaire.

## 🚀 Utilisation

1. Allez sur **https://www.vinted.fr/my_orders**
2. Cliquez sur l'**icône de l'extension** dans la barre Chrome
3. Cliquez sur **"Scanner mes commandes Vinted"**
4. 📥 Le fichier JSON est automatiquement téléchargé !

## 📄 Format du fichier JSON

Le fichier téléchargé contient :

```json
{
  "metadata": {
    "totalOrders": 3,
    "scannedAt": "2025-12-25T20:48:00.000Z",
    "source": "vinted"
  },
  "orders": [
    {
      "orderId": "19861078867",
      "title": "Bottes grise à bout carré...",
      "price": "40,50 €",
      "status": "Bordereau envoyé au vendeur",
      "conversationUrl": "https://www.vinted.fr/inbox/19861078867",
      "shippingLabelUrl": "https://svc-shipping-labels.s3...",
      "fetchedAt": "2025-12-25T20:48:00.000Z",
      "source": "vinted"
    }
  ]
}
```

## 🎯 Que faire avec le JSON ?

- **Importer dans Excel/Google Sheets** : Convertir en CSV
- **Analyser vos ventes** : Prix moyen, CA total, articles les plus vendus
- **Télécharger les bordereaux** : Utiliser les URLs `shippingLabelUrl`
- **Alimenter votre CRM** : Importer dans votre base de données

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Guide de démarrage rapide
- **[FORMAT-JSON.md](FORMAT-JSON.md)** - Détails du format JSON + exemples de code
- **[exemple-output.json](exemple-output.json)** - Exemple de fichier généré

## 🔒 Sécurité

✅ Aucune donnée envoyée à un serveur tiers
✅ Tout reste sur votre ordinateur
✅ Utilise votre session Vinted existante
✅ Code source ouvert et auditable

## 💡 Astuce

Exportez vos commandes régulièrement (toutes les semaines) pour garder un historique complet de vos ventes !

---

**Bon export ! 📦✨**
