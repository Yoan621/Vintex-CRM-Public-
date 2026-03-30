# 🚀 Guide de démarrage rapide - Vintex CRM Extension

Ce guide vous permet de tester l'extension en **moins de 5 minutes**.

L'extension génère un fichier JSON avec toutes vos commandes Vinted (titre, prix, statut, bordereau PDF) que vous pouvez ensuite importer dans votre CRM ou analyser.

## ⚡ Installation rapide

### 1. Générer les icônes (30 secondes)

**🌐 Méthode la plus simple (aucune installation requise) :**

1. Ouvrez le fichier **`icons/generate-icons-browser.html`** dans Chrome (double-clic)
2. Cliquez sur **"Télécharger toutes les icônes"**
3. Déplacez les 4 fichiers PNG téléchargés dans le dossier **`icons/`**

**🐍 Alternative avec Python (si vous préférez) :**
```bash
cd "Extension Vintex CRM/icons"
pip install pillow
python3 generate_simple_icons.py
```

### 2. Charger l'extension dans Chrome (30 secondes)

1. Ouvrez Chrome → `chrome://extensions/`
2. Activez le **Mode développeur** (coin supérieur droit)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier `Extension Vintex CRM`
5. ✅ L'extension est installée !

### 3. Tester l'extension (2 minutes)

1. Allez sur **https://www.vinted.fr**
2. **Connectez-vous** à votre compte
3. Allez sur **https://www.vinted.fr/my_orders**
4. Cliquez sur l'icône de l'extension
5. Cliquez sur **"Scanner mes commandes Vinted"**
6. 🎉 Regardez la magie opérer !

## 📊 Résultat attendu

Un fichier JSON sera automatiquement téléchargé avec un nom du type :
`vinted-orders-2025-12-25-20-48-00.json`

Le fichier contiendra toutes vos commandes au format :

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

Vous pouvez consulter [exemple-output.json](exemple-output.json) pour voir un exemple complet.

## 🔧 En cas de problème

### Les icônes ne se génèrent pas

**Si vous utilisez la méthode navigateur :**
- Assurez-vous d'ouvrir le fichier dans Chrome (pas Safari ou Firefox)
- Les téléchargements doivent être autorisés dans Chrome
- Déplacez manuellement les fichiers téléchargés dans `icons/`

**Si vous utilisez Python :**
```bash
# Vérifiez que Python 3 est installé
python3 --version

# Installez Pillow
pip3 install pillow
```

### L'extension ne trouve pas la page
- Assurez-vous d'être sur `https://www.vinted.fr/my_orders` (pas `/my_orders/sold` ou autre)
- Rechargez la page si nécessaire

### Le fichier JSON n'est pas téléchargé
- Vérifiez que Chrome a la permission de télécharger des fichiers
- Consultez la console Chrome (F12) pour voir les erreurs éventuelles
- Rechargez l'extension depuis `chrome://extensions/`

## 🎯 Prochaines étapes

Une fois que l'extension fonctionne :

1. **Importez le JSON dans votre CRM** : Utilisez le fichier JSON généré pour alimenter votre base de données
2. **Automatisez le traitement** : Créez un script pour importer automatiquement les fichiers JSON
3. **Analysez vos données** : Prix moyen, délais d'expédition, taux de vente, etc.
4. **Téléchargez les bordereaux PDF** : Utilisez les URLs `shippingLabelUrl` pour sauvegarder les PDFs
5. **Customisez les icônes** : Créez vos propres icônes avec votre charte graphique

### Option : Envoi automatique au backend

Si vous voulez que l'extension envoie directement au backend au lieu de télécharger un JSON :
- Configurez l'URL de votre API dans les options
- Consultez [backend-example.js](backend-example.js) pour un exemple de backend Node.js

## 📚 Documentation complète

Pour plus d'informations, consultez le [README.md](README.md) complet.

---

**Bon scraping ! 🎉**
