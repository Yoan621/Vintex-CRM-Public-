# 📦 Système de Scraping Vinted - VINTEX CRM

## 🎯 Vue d'ensemble

Système automatisé de scraping du profil Vinted pour alimenter la section "Gestion des Stocks" du CRM VINTEX.

### Fonctionnalités

- ✅ **Scraping automatique** des articles depuis le profil Vinted
- ✅ **Extraction XPath** précise des données (nom, prix, taille, photo)
- ✅ **Synchronisation base de données** SQLite avec Prisma
- ✅ **Interface UI** avec boutons de test et synchronisation complète
- ✅ **Logs détaillés** de chaque opération de scraping
- ✅ **Mode test** pour scraper seulement 2 articles

---

## 🏗️ Architecture

```
VINTEX/
├── lib/
│   ├── services/
│   │   └── vintedScraper.ts      ← Service principal de scraping
│   └── db/
│       └── prisma.ts              ← Client Prisma
├── app/
│   ├── api/
│   │   └── scraping/
│   │       └── manual/
│   │           └── route.ts       ← API endpoint
│   └── stocks/
│       └── page.tsx               ← Page UI avec boutons
├── prisma/
│   ├── schema.prisma              ← Schéma base de données
│   └── dev.db                     ← Base SQLite
└── .env
```

---

## 📊 Base de données

### Modèles Prisma

#### Article
```typescript
{
  id: string              // ID unique
  articleUrl: string      // URL Vinted complète
  vintedId: string        // ID Vinted (unique)

  // Données scrapées
  nom: string             // Nom du produit
  prix: number            // Prix en euros
  taille: string          // Taille (XS, S, M, L...)
  photoUrl: string        // URL de la photo

  // Données supplémentaires
  marque: string
  etat: string
  statut: string          // en_vente | reserve | vendu
  estActif: boolean

  // Métadonnées
  dateAjout: DateTime
  dateMiseAJour: DateTime
  derniereSync: DateTime
}
```

#### ScrapingLog
```typescript
{
  id: string
  dateExecution: DateTime
  statut: string          // success | error | partial
  articlesNouveaux: number
  articlesModifies: number
  articlesSupprimes: number
  dureeSecondes: number
  messageErreur: string
}
```

---

## 🚀 Utilisation

### 1. Via l'Interface UI

Rendez-vous sur: **http://localhost:3001/stocks**

Vous verrez 3 boutons dans l'en-tête:

#### 🔵 **Test Sync** (Bleu)
- Scrape **seulement 2 articles** pour tester
- Utile pour vérifier que tout fonctionne
- Durée: ~20-30 secondes

#### 🟢 **Sync Vinted** (Vert)
- Scrape **TOUS les articles** du profil
- Synchronise la base de données complète
- Durée: ~2-5 minutes selon le nombre d'articles

#### 🟣 **Ajouter un article** (Violet)
- Ajout manuel d'un article (fonctionnalité existante)

### 2. Via l'API

#### Test avec 2 articles
```bash
curl -X POST http://localhost:3001/api/scraping/manual \
  -H "Content-Type: application/json" \
  -d '{
    "profileUrl": "https://www.vinted.fr/member/178767503",
    "testMode": true
  }'
```

#### Synchronisation complète
```bash
curl -X POST http://localhost:3001/api/scraping/manual \
  -H "Content-Type: application/json" \
  -d '{
    "profileUrl": "https://www.vinted.fr/member/178767503",
    "testMode": false
  }'
```

#### Vérifier que l'API fonctionne
```bash
curl http://localhost:3001/api/scraping/manual
```

---

## 🧪 Test du scraping

### Étape 1 : Test sur 2 articles

1. Allez sur http://localhost:3001/stocks
2. Cliquez sur **"Test Sync"** (bouton bleu)
3. Attendez ~20-30 secondes
4. Vous devriez voir une alerte verte avec:
   ```
   ✅ Test terminé : 2 nouveaux, 0 modifiés
   2 nouveaux • 0 modifiés • 0 supprimés • 25s
   ```
5. La page se recharge automatiquement après 2 secondes
6. Vérifiez que les 2 articles apparaissent dans la liste

### Étape 2 : Vérifier dans la base de données

```bash
# Installer l'explorateur SQLite (optionnel)
npm install -g sqlite3

# Voir les articles scrapés
sqlite3 prisma/dev.db "SELECT nom, prix, taille FROM Article;"

# Voir les logs de scraping
sqlite3 prisma/dev.db "SELECT * FROM ScrapingLog ORDER BY dateExecution DESC LIMIT 5;"
```

### Étape 3 : Test de synchronisation complète

1. Cliquez sur **"Sync Vinted"** (bouton vert)
2. Attendez 2-5 minutes selon le nombre d'articles
3. Suivez les logs dans le terminal Next.js:
   ```
   🚀 Initialisation du navigateur...
   ✅ Navigateur initialisé
   📄 Chargement du profil: https://www.vinted.fr/member/178767503
   ⏬ Scroll pour charger tous les articles...
   ✅ 45 articles trouvés

   📦 Scraping de 45 article(s)...

   [1/45]    Scraping: https://www.vinted.fr/items/...
   [1/45]    ✅ "T-shirt Nike vintage" - 15€
   ...
   ```

---

## 🔍 XPath utilisés

Les XPath fournis pour extraire les données:

| Donnée | XPath |
|--------|-------|
| **Nom** | `//*[@id="content"]/section/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div[1]/div[1]/h1` |
| **Prix** | `//*[@id="content"]/section/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div[2]/div[1]/div[1]/p` |
| **Taille** | `//*[@id="content"]/section/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div[3]/div[3]/div/div[2]/span` |
| **Photo** | `//*[@id="content"]/section/section/div/figure[2]` |

---

## ⚙️ Configuration

### Variables d'environnement

Fichier `.env`:
```env
DATABASE_URL="file:./dev.db"
```

### Configuration du scraper

Dans `lib/services/vintedScraper.ts`:

```typescript
// Délai entre chaque requête (anti-détection)
const delayMs = 1000 + Math.random() * 2000 // 1-3 secondes

// User-Agent
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'

// Headless mode
headless: true // false pour voir le navigateur
```

---

## 🐛 Dépannage

### Erreur : "Browser not initialized"
```bash
# Réinstaller Puppeteer
npm install puppeteer --force
```

### Erreur : "Cannot find module '@prisma/client'"
```bash
# Régénérer le client Prisma
npx prisma generate
npx prisma db push
```

### Erreur : "requires either adapter or accelerateUrl"
```bash
# Installer les adapters Prisma 7 pour SQLite
npm install @prisma/adapter-libsql @libsql/client

# Supprimer le cache Next.js et redémarrer
rm -rf .next
npm run dev
```

### Erreur : "Port already in use"
```bash
# Tuer le processus sur le port 3001
lsof -ti:3001 | xargs kill
npm run dev
```

### Le scraping est trop lent
- **Cause**: Délais anti-détection trop longs
- **Solution**: Réduire les délais dans `vintedScraper.ts`:
  ```typescript
  const delayMs = 500 + Math.random() * 500 // 0.5-1 sec
  ```
- **⚠️ Attention**: Risque de détection comme bot

### Articles non trouvés
- Vérifier que l'URL du profil est correcte
- Vérifier que les XPath sont toujours valides (Vinted peut changer sa structure)
- Regarder les logs dans le terminal

---

## 📝 Logs et Monitoring

### Logs dans le terminal Next.js

```
🚀 Initialisation du navigateur...
✅ Navigateur initialisé
📄 Chargement du profil: https://www.vinted.fr/member/178767503
⏬ Scroll pour charger tous les articles...
✅ 45 articles trouvés

📦 Scraping de 45 article(s)...

[1/45]
   Scraping: https://www.vinted.fr/items/7663995734-gilet-zippe
   ✅ "Gilet zippé maille noir" - 25€
[2/45]
   Scraping: https://www.vinted.fr/items/...
   ⚠️  Données incomplètes pour: ...

✅ Scraping terminé: 43 réussis, 2 échecs

💾 Sauvegarde dans la base de données...
   ✨ Nouveau: Gilet zippé maille noir
   📝 Modifié: T-shirt Nike vintage
   ...
   🗑️  2 article(s) marqué(s) comme vendu(s)

✅ Synchronisation terminée en 187s
   📊 5 nouveaux | 38 modifiés | 2 supprimés
```

### Consulter les logs en base

```sql
-- Derniers scraping
SELECT
  dateExecution,
  statut,
  articlesNouveaux,
  articlesModifies,
  dureeSecondes
FROM ScrapingLog
ORDER BY dateExecution DESC
LIMIT 10;

-- Scraping en erreur
SELECT * FROM ScrapingLog WHERE statut = 'error';
```

---

## 🔄 Workflow de synchronisation

1. **Scraping du profil** → Extraction des URLs des articles
2. **Scraping individuel** → Pour chaque URL, extraction des données
3. **Sauvegarde en base**:
   - Articles nouveaux → `INSERT`
   - Articles modifiés (prix/nom) → `UPDATE`
   - Articles absents → Marqués comme `vendu`
4. **Logging** → Enregistrement dans `ScrapingLog`
5. **Rafraîchissement UI** → Rechargement automatique de la page

---

## 🚨 Contraintes et Bonnes Pratiques

### ⚠️ Respect des conditions Vinted

- ✅ Délais entre requêtes (1-3 secondes)
- ✅ User-Agent réaliste
- ✅ Pas de scraping excessif (max 1x/heure recommandé)
- ✅ Headless mode en production

### 🛡️ Anti-détection

- User-Agent navigateur réel
- Délais aléatoires entre requêtes
- Scroll progressif (simuler navigation humaine)
- Pas de requêtes parallèles massives

### 💾 Performance

- Mode test (2 articles) : ~20-30 secondes
- Scraping complet (50 articles) : ~2-5 minutes
- Base de données SQLite (performante pour <10k articles)

---

## 📚 Ressources

- [Puppeteer Documentation](https://pptr.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [XPath Cheatsheet](https://devhints.io/xpath)

---

## ✅ Checklist de test

- [ ] Installation des dépendances OK
- [ ] Base de données créée (prisma/dev.db)
- [ ] Serveur Next.js démarre sans erreur
- [ ] Page /stocks accessible
- [ ] Bouton "Test Sync" visible
- [ ] Test sur 2 articles réussi
- [ ] Articles visibles dans la base
- [ ] Logs de scraping enregistrés
- [ ] Synchronisation complète testée
- [ ] Articles supprimés marqués "vendu"

---

## 🎉 Félicitations !

Votre système de scraping Vinted est opérationnel !

Pour toute question ou problème, vérifiez:
1. Les logs dans le terminal Next.js
2. Les logs dans la base de données (`ScrapingLog`)
3. Les erreurs dans la console navigateur (F12)
