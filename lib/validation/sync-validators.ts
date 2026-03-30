import { z } from 'zod'

// ───────────────────────────────────────────────────────────────────────────
// SCHÉMA VENTE
// ───────────────────────────────────────────────────────────────────────────

export const VenteSchema = z.object({
  transactionNumber: z.string().min(1, 'Numéro de transaction requis'),
  vintedId: z.string().optional().nullable(),

  // Article
  articleName: z.string().min(1, 'Nom de l\'article requis'),
  brandName: z.string().min(1, 'Nom de la marque requis'),
  articleImage: z.string().url('URL de l\'image invalide').optional().nullable(),

  // Prix
  purchasePrice: z.number().nonnegative('Prix d\'achat ne peut pas être négatif').default(0),
  salePrice: z.number().positive('Prix de vente doit être positif'),
  profit: z.number(),

  // Dates
  purchaseDate: z.coerce.date(),
  saleDate: z.coerce.date(),
  validationDate: z.coerce.date().optional().nullable(),
  shippingDate: z.coerce.date().optional().nullable(),
  cancellationDate: z.coerce.date().optional().nullable(),

  // Livraison
  trackingNumber: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),

  // Parties
  customerName: z.string().min(1, 'Nom du client requis'),
  vintedAccount: z.string().min(1, 'Compte Vinted requis'),

  // Statut
  status: z.enum(['non_traite', 'en_cours', 'validée', 'litige', 'annulée'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }),

  // Documents (optionnels)
  invoice: z.string().optional().nullable(),
  shippingLabel: z.string().optional().nullable(),

  // Litige (optionnels)
  disputeReason: z.string().optional().nullable(),
  disputeDate: z.coerce.date().optional().nullable(),
  disputeResolved: z.boolean().default(false),
  disputeAction: z.string().optional().nullable(),

  // Annulation (optionnels)
  cancellationReason: z.string().optional().nullable(),

  // Archivage (optionnels)
  archived: z.boolean().default(false),
  archivedDate: z.coerce.date().optional().nullable()
})

export const VenteArraySchema = z.array(VenteSchema)

export type VenteInput = z.infer<typeof VenteSchema>

// ───────────────────────────────────────────────────────────────────────────
// SCHÉMA ACHAT
// ───────────────────────────────────────────────────────────────────────────

export const AchatSchema = z.object({
  numeroTransaction: z.string().min(1, 'Numéro de transaction requis'),
  vintedId: z.string().optional().nullable(),

  // Article
  nomArticle: z.string().min(1, 'Nom de l\'article requis'),
  marque: z.string().min(1, 'Marque requise'),
  taille: z.string().min(1, 'Taille requise'),
  photo: z.string().url('URL de la photo invalide').optional().nullable(),

  // Prix
  prixAchat: z.number().positive('Prix d\'achat doit être positif'),
  fraisPort: z.number().nonnegative('Frais de port ne peut pas être négatif').default(0),
  coutTotal: z.number().positive('Coût total doit être positif'),
  prixReventePrevu: z.number().positive('Prix de revente prévu doit être positif').optional().nullable(),
  margeEstimee: z.number().default(0),

  // Transaction
  dateAchat: z.coerce.date(),
  plateforme: z.string().default('vinted'),
  vendeur: z.string().optional().nullable(),
  compteVinted: z.string().min(1, 'Compte Vinted requis'),

  // Livraison
  numeroSuivi: z.string().optional().nullable(),

  // Statut
  statut: z.enum(['en_attente', 'expedie', 'recu', 'en_stock', 'revendu', 'retourne', 'litige'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }).default('en_attente'),

  // Notes
  notes: z.string().optional().nullable()
})

export const AchatArraySchema = z.array(AchatSchema)

export type AchatInput = z.infer<typeof AchatSchema>

// ───────────────────────────────────────────────────────────────────────────
// SCHÉMA BOOST
// ───────────────────────────────────────────────────────────────────────────

export const BoostSchema = z.object({
  date: z.coerce.date(),
  article: z.string().min(1, 'Nom de l\'article requis'),
  articleId: z.string().optional().nullable(),
  prix: z.number().positive('Prix du boost doit être positif'),
  duration: z.enum(['3j', '7j'], {
    errorMap: () => ({ message: 'Durée doit être 3j ou 7j' })
  }),
  dateExpiration: z.coerce.date().optional().nullable(),
  status: z.enum(['actif', 'expiré', 'annulé'], {
    errorMap: () => ({ message: 'Statut invalide' })
  })
})

export const BoostArraySchema = z.array(BoostSchema)

export type BoostInput = z.infer<typeof BoostSchema>

// ───────────────────────────────────────────────────────────────────────────
// SCHÉMA ARTICLE (pour sync articles en vente)
// ───────────────────────────────────────────────────────────────────────────

export const ArticleSyncSchema = z.object({
  articleUrl: z.string().url('URL de l\'article invalide'),
  vintedId: z.string().min(1, 'ID Vinted requis'),
  nom: z.string().min(1, 'Nom de l\'article requis'),
  prix: z.number().positive('Prix doit être positif'),
  taille: z.string().optional().nullable(),
  photoUrl: z.string().url('URL de la photo invalide').optional().nullable(),
  marque: z.string().optional().nullable(),
  etat: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  nombreVues: z.number().int().nonnegative('Nombre de vues ne peut pas être négatif').default(0),
  nombreLikes: z.number().int().nonnegative('Nombre de likes ne peut pas être négatif').default(0),
  statut: z.string().default('en_vente'),
  estActif: z.boolean().default(true)
})

export const ArticleSyncArraySchema = z.array(ArticleSyncSchema)

export type ArticleSyncInput = z.infer<typeof ArticleSyncSchema>

// ───────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────────────

/**
 * Valide un tableau de ventes
 * @param ventes - Données de ventes à valider
 * @returns Données validées ou lance une erreur
 */
export function validateVentes(ventes: unknown) {
  return VenteArraySchema.parse(ventes)
}

/**
 * Valide un tableau d'achats
 * @param achats - Données d'achats à valider
 * @returns Données validées ou lance une erreur
 */
export function validateAchats(achats: unknown) {
  return AchatArraySchema.parse(achats)
}

/**
 * Valide un tableau de boosts
 * @param boosts - Données de boosts à valider
 * @returns Données validées ou lance une erreur
 */
export function validateBoosts(boosts: unknown) {
  return BoostArraySchema.parse(boosts)
}

/**
 * Valide un tableau d'articles
 * @param articles - Données d'articles à valider
 * @returns Données validées ou lance une erreur
 */
export function validateArticles(articles: unknown) {
  return ArticleSyncArraySchema.parse(articles)
}

/**
 * Formatte les erreurs Zod pour une meilleure lisibilité
 * @param error - Erreur Zod
 * @returns Message d'erreur formaté
 */
export function formatZodError(error: z.ZodError): string {
  return error.errors
    .map(err => `${err.path.join('.')}: ${err.message}`)
    .join(', ')
}
