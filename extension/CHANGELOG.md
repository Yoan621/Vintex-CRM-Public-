# 📋 Changelog - Vintex CRM Extension

## Version 1.0.0 - 2025-12-25

### ✨ Fonctionnalités principales

- **Export JSON** : L'extension génère maintenant un fichier JSON au lieu d'envoyer directement au backend
- **Scraping automatique** : Extraction des commandes depuis `/my_orders`
- **Récupération des bordereaux** : Capture automatique des URLs des bordereaux d'envoi PDF
- **Interface moderne** : Popup avec barre de progression et aperçu des résultats
- **Gestion d'erreurs** : Les commandes sans bordereau disponible sont marquées avec `shippingLabelUrl: null`

### 📦 Format de sortie

Le fichier JSON téléchargé contient :
- **Metadata** : nombre de commandes, date du scan, source
- **Orders** : liste complète avec tous les détails de chaque commande
  - ID, titre, prix, statut
  - URL de conversation
  - URL du bordereau PDF (si disponible)
  - Dates de récupération

Voir [FORMAT-JSON.md](FORMAT-JSON.md) pour plus de détails.

### 🎯 Utilisation

1. Ouvrir `https://www.vinted.fr/my_orders`
2. Cliquer sur l'extension
3. Cliquer sur "Scanner mes commandes Vinted"
4. Le fichier JSON est automatiquement téléchargé

### 📁 Fichiers inclus

**Extension Chrome :**
- `manifest.json` - Configuration Manifest V3
- `background.js` - Service worker principal
- `content-my-orders.js` - Scraping de /my_orders
- `content-inbox.js` - Récupération des bordereaux
- `content-inbox-injected.js` - Interception des requêtes réseau
- `popup.html` / `popup.js` - Interface utilisateur
- `options.html` / `options.js` - Page de configuration (pour envoi backend optionnel)

**Documentation :**
- `README.md` - Documentation complète
- `QUICKSTART.md` - Guide de démarrage rapide (5 min)
- `FORMAT-JSON.md` - Détails du format JSON et exemples d'utilisation
- `exemple-output.json` - Exemple de fichier généré

**Outils :**
- `icons/` - Icônes de l'extension + scripts de génération
- `backend-example.js` - Backend Node.js exemple (optionnel)
- `.gitignore` - Fichiers à ignorer

### 🔒 Sécurité

- ✅ Aucun identifiant Vinted stocké
- ✅ Fonctionne uniquement avec votre session Chrome
- ✅ Pas de serveur tiers impliqué
- ✅ Données stockées localement dans le fichier JSON

### 🚀 Prochaines améliorations possibles

- [ ] Support de la pagination sur `/my_orders`
- [ ] Option pour télécharger automatiquement les PDFs des bordereaux
- [ ] Export CSV en plus du JSON
- [ ] Synchronisation automatique programmée
- [ ] Filtres par date/statut avant l'export

### 🐛 Bugs connus

- Les URLs de bordereau AWS S3 expirent après ~7 jours
- Certaines commandes peuvent ne pas avoir de bordereau disponible selon leur statut
- L'interception du lien peut échouer si Vinted change sa structure

### 📝 Notes techniques

**Permissions Chrome utilisées :**
- `activeTab` - Accès à l'onglet actif
- `scripting` - Injection de scripts
- `tabs` - Gestion des onglets
- `storage` - Stockage de la configuration
- `downloads` - Téléchargement du fichier JSON

**Compatibilité :**
- Chrome/Chromium 88+
- Manifest V3
- Testé sur macOS et Windows

---

Pour toute question : consultez [README.md](README.md) ou [QUICKSTART.md](QUICKSTART.md)
