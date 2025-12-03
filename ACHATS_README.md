# Page "Mes Achats" - Documentation

## Structure des fichiers créés

```
Vintex/
├── app/
│   ├── achats/
│   │   ├── page.tsx                      # Page principale
│   │   └── components/
│   │       ├── StatsCards.tsx            # 3 cartes KPI
│   │       ├── SearchBar.tsx             # Recherche + filtres
│   │       ├── AchatsTable.tsx           # Tableau des achats
│   │       ├── AchatRow.tsx              # Ligne de tableau / Card mobile
│   │       ├── AddAchatModal.tsx         # Modale d'ajout
│   │       ├── DetailAchatModal.tsx      # Modale de détail
│   │       ├── ActionMenu.tsx            # Menu kebab (⋮)
│   │       └── EmptyState.tsx            # État vide
│   └── layout.tsx                        # Navigation mise à jour
│
├── components/
│   └── ui/
│       ├── Modal.tsx                     # Composant modal réutilisable
│       ├── Badge.tsx                     # Badge réutilisable
│       └── Button.tsx                    # Bouton réutilisable
│
├── types/
│   └── achat.ts                          # Types TypeScript
│
└── lib/
    └── mock-data/
        └── achats.ts                     # Données de démonstration
```

## Fonctionnalités implémentées

### ✅ Interface utilisateur complète

- **3 KPI Cards** : Argent dépensé, Articles achetés, Marge estimée
- **Barre de recherche** : Recherche en temps réel par article, marque, vendeur, n° transaction
- **Filtres** : Par statut (en attente, expédié, reçu, en stock, revendu) et plateforme (Vinted, LeBonCoin, etc.)
- **Tableau responsive** : Version desktop (tableau) + mobile (cards empilées)
- **Modales** : Ajout d'achat avec drag & drop + Détail complet

### ✅ Interactions fonctionnelles (frontend only)

- Recherche en temps réel
- Filtrage par statut et plateforme
- Ajout d'achats (simulation)
- Suppression d'achats (simulation)
- Calcul automatique du coût total et de la marge
- Upload drag & drop (preview)
- Menu d'actions (kebab menu)

### ✅ Design & Responsive

- Tailwind CSS avec système de couleurs cohérent
- Badges colorés pour statuts et plateformes
- Animations subtiles (hover, transitions)
- Responsive : Desktop (3 cols) / Tablet (2 cols) / Mobile (1 col)
- États vides pour aucun achat / aucun résultat

## Démarrage rapide

1. **Installer les dépendances nécessaires** :
```bash
npm install lucide-react
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Accéder à la page** :
```
http://localhost:3000/achats
```

## Données de démonstration

La page utilise actuellement des données mockées depuis `lib/mock-data/achats.ts`.

- **8 achats** de démonstration avec différents statuts
- **Stats calculées** : 1247.50€ dépensés, 23 articles, 687.30€ de marge

## Points d'intégration futurs

Tous les endroits où connecter une API sont marqués avec :

```typescript
// TODO: Connecter à l'API
console.log('Mode démo:', data)
```

### Endpoints API à créer :

1. **GET /api/achats** - Liste des achats
2. **POST /api/achats** - Créer un achat
3. **PUT /api/achats/:id** - Modifier un achat
4. **DELETE /api/achats/:id** - Supprimer un achat
5. **POST /api/achats/:id/stock** - Ajouter au stock
6. **POST /api/achats/upload** - Upload de photos

### Fonctions à connecter dans `app/achats/page.tsx` :

- `handleAddAchat()` - ligne 56
- `handleEditAchat()` - ligne 73
- `handleDeleteAchat()` - ligne 80
- `handleAddToStock()` - ligne 92

## Composants réutilisables créés

### Modal (`components/ui/Modal.tsx`)
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Titre"
  size="lg"
>
  {children}
</Modal>
```

### Badge (`components/ui/Badge.tsx`)
```tsx
<Badge variant="statut" value="recu" />
<Badge variant="plateforme" value="vinted" />
```

### Button (`components/ui/Button.tsx`)
```tsx
<Button variant="primary">Enregistrer</Button>
<Button variant="secondary">Annuler</Button>
<Button variant="danger">Supprimer</Button>
```

## Personnalisation

### Couleurs des badges

Modifiez dans `components/ui/Badge.tsx` :

```typescript
const plateformeConfig = {
  vinted: { className: 'bg-purple-100 text-purple-700' },
  leboncoin: { className: 'bg-orange-100 text-orange-700' },
  // ...
}
```

### Ajout de colonnes au tableau

1. Ajoutez le champ dans `types/achat.ts`
2. Ajoutez le `<th>` dans `AchatsTable.tsx`
3. Ajoutez le `<td>` dans `AchatRow.tsx`

## Checklist de test

- [ ] Accéder à `/achats` depuis la navigation
- [ ] Les 3 KPI cards s'affichent correctement
- [ ] La recherche filtre les résultats en temps réel
- [ ] Les filtres statut et plateforme fonctionnent
- [ ] Cliquer sur "Nouvel achat" ouvre la modale
- [ ] Remplir le formulaire calcule automatiquement le total
- [ ] Drag & drop d'une image affiche son nom
- [ ] Le formulaire valide les champs obligatoires
- [ ] Enregistrer ajoute l'achat à la liste (console.log)
- [ ] Cliquer sur un n° de transaction ouvre le détail
- [ ] Le menu kebab (⋮) affiche les actions
- [ ] Supprimer un achat le retire de la liste
- [ ] Responsive : tester sur mobile/tablet/desktop
- [ ] État vide s'affiche si aucun achat
- [ ] "Aucun résultat" s'affiche si recherche vide

## Prochaines étapes

1. **Backend** : Créer les endpoints API
2. **Base de données** : Définir le schéma pour la table `achats`
3. **Upload** : Intégrer un service de stockage (AWS S3, Cloudinary, etc.)
4. **Authentification** : Filtrer les achats par utilisateur
5. **Export** : Ajouter l'export CSV des achats
6. **Tri** : Ajouter le tri par colonne (clic sur header)
7. **Pagination** : Paginer si plus de 50 achats
8. **Graphiques** : Ajouter des graphiques d'évolution

## Support

Pour toute question ou problème :
- Vérifiez les console.log dans le navigateur
- Consultez la documentation Next.js 14
- Inspectez les composants avec React DevTools

---

**Version** : 1.0.0 (Frontend Only)
**Dernière mise à jour** : Décembre 2024
