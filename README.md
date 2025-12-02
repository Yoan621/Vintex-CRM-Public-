# Vintex CRM - Gestion Vinted

Un CRM moderne et professionnel pour gérer votre activité de revente sur Vinted. Développé avec Next.js 14, React, TypeScript et Tailwind CSS.

## Fonctionnalités

### Dashboard
- **KPIs avec comparaison mensuelle**
  - Chiffre d'affaires avec variation % vs mois précédent
  - Bénéfices nets après frais avec variation %
  - Nombre de commandes avec variation %
  - Icônes personnalisées et indicateurs visuels (↑/↓)

- **Graphique évolutif**
  - Visualisation du CA et des bénéfices
  - Filtres par période : Jour / Semaine / Mois / Année
  - Tooltips interactifs au survol
  - Design responsive avec Recharts

- **Suivi des commandes par statut**
  - 4 onglets de filtrage : Toutes / En cours / Validées / Annulées
  - Colonnes adaptatives selon le statut
  - Téléchargement des bordereaux d'envoi

### Page Mes Ventes
- **Tableau complet avec toutes les informations**
  - N° de transaction
  - Nom de l'article
  - Statut avec badge coloré
  - Prix d'achat et de vente
  - Bénéfice calculé automatiquement
  - N° de suivi
  - Nom du client
  - Actions : voir détails, télécharger facture, voir article, éditer, supprimer

- **Fonctionnalités avancées**
  - Recherche en temps réel
  - Tri par colonnes (cliquables)
  - Pagination automatique (10 items par page)
  - Statistiques rapides en en-tête

## Architecture du projet

```
Vintex/
├── app/
│   ├── dashboard/
│   │   └── page.tsx           # Page Dashboard
│   ├── ventes/
│   │   └── page.tsx           # Page Mes Ventes
│   ├── layout.tsx             # Layout principal avec navigation
│   ├── page.tsx               # Page d'accueil
│   └── globals.css            # Styles globaux
├── components/
│   ├── dashboard/
│   │   ├── KPICard.tsx        # Carte KPI
│   │   ├── SalesChart.tsx     # Graphique des ventes
│   │   └── OrdersTable.tsx    # Tableau des commandes
│   └── ventes/
│       └── SalesTable.tsx     # Tableau des ventes
├── lib/
│   ├── types.ts               # Types TypeScript
│   └── utils.ts               # Fonctions utilitaires
└── data/
    └── mockData.ts            # Données de démonstration
```

## Technologies utilisées

- **Framework**: Next.js 14 avec App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Graphiques**: Recharts
- **Icônes**: Lucide React
- **Dates**: date-fns
- **Utilitaires**: clsx, tailwind-merge

## Installation et démarrage

### Prérequis
- Node.js 18+ et npm

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer la version de production
npm start
```

Le projet sera accessible sur [http://localhost:3000](http://localhost:3000)

## Pages disponibles

- `/` - Page d'accueil avec présentation des fonctionnalités
- `/dashboard` - Dashboard principal avec KPIs et graphiques
- `/ventes` - Page de gestion des ventes

## Personnalisation

### Modifier les données de démonstration
Éditez le fichier `data/mockData.ts` pour modifier les commandes et les données du graphique.

### Ajouter de nouvelles fonctionnalités
1. Créez vos composants dans le dossier `components/`
2. Ajoutez vos types dans `lib/types.ts`
3. Ajoutez vos utilitaires dans `lib/utils.ts`
4. Créez de nouvelles pages dans `app/`

### Styles
Le projet utilise Tailwind CSS avec support du dark mode. Les couleurs et le design peuvent être personnalisés dans `tailwind.config.ts`.

## Fonctionnalités à venir

- [ ] Connexion à une vraie API backend
- [ ] Authentification utilisateur
- [ ] Upload de fichiers (factures, bordereaux)
- [ ] Export des données en CSV/Excel
- [ ] Notifications push
- [ ] Mode d'édition en ligne des commandes
- [ ] Statistiques avancées et rapports
- [ ] Gestion des stocks

## Support

Pour toute question ou suggestion, n'hésitez pas à créer une issue sur le repository.

## Licence

Ce projet est sous licence MIT.
# Vintex-CRM-Public-
