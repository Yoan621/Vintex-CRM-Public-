import { Achat, AchatStats } from '@/types/achat'

/**
 * Données de démonstration pour les achats
 */
export const mockAchats: Achat[] = [
  {
    id: '1',
    numeroTransaction: '#ACH-2024-001',
    nomArticle: "Jean Levi's 501",
    marque: "Levi's",
    taille: '32',
    prixAchat: 25,
    fraisPort: 5,
    coutTotal: 30,
    dateAchat: '2024-01-15',
    plateforme: 'vinted',
    vendeur: 'Marie_fashion',
    statut: 'recu',
    numeroSuivi: 'LA123456789',
    urlSuivi: 'https://laposte.fr/track/LA123456789',
    prixReventePrevu: 45,
    margeEstimee: 15,
    photo: '/images/jean-levis.jpg',
    notes: 'Très bon état, petite tache sur la poche',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '2',
    numeroTransaction: '#ACH-2024-002',
    nomArticle: 'Veste en cuir Zara',
    marque: 'Zara',
    taille: 'M',
    prixAchat: 35,
    fraisPort: 6,
    coutTotal: 41,
    dateAchat: '2024-01-20',
    plateforme: 'leboncoin',
    vendeur: 'Paul_vintage',
    statut: 'expedie',
    numeroSuivi: 'FR987654321',
    urlSuivi: 'https://colissimo.fr/track/FR987654321',
    prixReventePrevu: 65,
    margeEstimee: 24,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T11:00:00Z'
  },
  {
    id: '3',
    numeroTransaction: '#ACH-2024-003',
    nomArticle: 'Robe H&M fleurie',
    marque: 'H&M',
    taille: '38',
    prixAchat: 12,
    fraisPort: 4,
    coutTotal: 16,
    dateAchat: '2024-01-22',
    plateforme: 'vide_grenier',
    statut: 'en_stock',
    prixReventePrevu: 28,
    margeEstimee: 12,
    photo: '/images/robe-hm.jpg',
    createdAt: '2024-01-22T15:45:00Z',
    updatedAt: '2024-01-23T09:30:00Z'
  },
  {
    id: '4',
    numeroTransaction: '#ACH-2024-004',
    nomArticle: 'Baskets Nike Air Max',
    marque: 'Nike',
    taille: '42',
    prixAchat: 45,
    fraisPort: 7,
    coutTotal: 52,
    dateAchat: '2024-01-25',
    plateforme: 'vinted',
    vendeur: 'Sneakers_shop',
    statut: 'revendu',
    prixReventePrevu: 75,
    margeEstimee: 23,
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-01-30T16:20:00Z'
  },
  {
    id: '5',
    numeroTransaction: '#ACH-2024-005',
    nomArticle: 'Pull cachemire Uniqlo',
    marque: 'Uniqlo',
    taille: 'L',
    prixAchat: 18,
    fraisPort: 4,
    coutTotal: 22,
    dateAchat: '2024-01-28',
    plateforme: 'vinted',
    vendeur: 'Julie_mode',
    statut: 'en_attente',
    notes: "Commande passée, en attente d'expédition",
    prixReventePrevu: 35,
    margeEstimee: 13,
    createdAt: '2024-01-28T14:30:00Z',
    updatedAt: '2024-01-28T14:30:00Z'
  },
  {
    id: '6',
    numeroTransaction: '#ACH-2024-006',
    nomArticle: 'Manteau long beige',
    marque: 'Mango',
    taille: 'S',
    prixAchat: 28,
    fraisPort: 5,
    coutTotal: 33,
    dateAchat: '2024-01-30',
    plateforme: 'vinted',
    vendeur: 'Sophie_chic',
    statut: 'recu',
    numeroSuivi: 'LA987123456',
    urlSuivi: 'https://laposte.fr/track/LA987123456',
    prixReventePrevu: 55,
    margeEstimee: 22,
    notes: 'Excellent état, jamais porté',
    createdAt: '2024-01-30T16:00:00Z',
    updatedAt: '2024-02-02T10:15:00Z'
  },
  {
    id: '7',
    numeroTransaction: '#ACH-2024-007',
    nomArticle: 'Sac à main Coach',
    marque: 'Coach',
    taille: 'Unique',
    prixAchat: 65,
    fraisPort: 8,
    coutTotal: 73,
    dateAchat: '2024-02-01',
    plateforme: 'leboncoin',
    vendeur: 'Luxe_occasion',
    statut: 'en_stock',
    prixReventePrevu: 120,
    margeEstimee: 47,
    notes: 'Authentique, avec certificat',
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2024-02-05T14:00:00Z'
  },
  {
    id: '8',
    numeroTransaction: '#ACH-2024-008',
    nomArticle: 'Chemise Ralph Lauren',
    marque: 'Ralph Lauren',
    taille: 'M',
    prixAchat: 22,
    fraisPort: 4,
    coutTotal: 26,
    dateAchat: '2024-02-03',
    plateforme: 'vinted',
    vendeur: 'Thomas_style',
    statut: 'expedie',
    numeroSuivi: 'MR456789123',
    urlSuivi: 'https://mondialrelay.fr/track/MR456789123',
    prixReventePrevu: 42,
    margeEstimee: 16,
    createdAt: '2024-02-03T09:45:00Z',
    updatedAt: '2024-02-04T16:30:00Z'
  }
]

/**
 * Statistiques calculées pour les KPI cards
 */
export const mockStats: AchatStats = {
  argentDepense: 1247.50,
  evolutionDepenses: 12.5,
  nombreArticles: 23,
  nouvelleArticles: 3,
  margeEstimee: 687.30,
  roi: 55,
  enAttente: 2,
  expedie: 3,
  recu: 8,
  enStock: 7,
  revendu: 3
}

/**
 * Fonction utilitaire pour calculer les statistiques à partir des achats
 * Utile pour la future intégration avec des données réelles
 */
export function calculateStats(achats: Achat[]): AchatStats {
  const argentDepense = achats.reduce((sum, achat) => sum + achat.coutTotal, 0)
  const margeEstimee = achats.reduce((sum, achat) => sum + (achat.margeEstimee || 0), 0)

  return {
    argentDepense,
    evolutionDepenses: 0, // À calculer avec historique
    nombreArticles: achats.length,
    nouvelleArticles: 0, // À calculer avec date
    margeEstimee,
    roi: argentDepense > 0 ? Math.round((margeEstimee / argentDepense) * 100) : 0,
    enAttente: achats.filter(a => a.statut === 'en_attente').length,
    expedie: achats.filter(a => a.statut === 'expedie').length,
    recu: achats.filter(a => a.statut === 'recu').length,
    enStock: achats.filter(a => a.statut === 'en_stock').length,
    revendu: achats.filter(a => a.statut === 'revendu').length
  }
}
