import { Achat, AchatStats } from '@/types/achat'

/**
 * Utilitaires pour générer des dates dynamiques
 */
const getDaysAgo = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

const getHoursAgo = (hours: number): string => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

/**
 * Données de démonstration pour les achats
 * Dates dynamiques pour tester les filtres temporels
 */
export const mockAchats: Achat[] = [
  // Achats d'aujourd'hui (jour)
  {
    id: '1',
    numeroTransaction: '#ACH-2026-001',
    nomArticle: "Jean Levi's 501",
    marque: "Levi's",
    taille: '32',
    prixAchat: 25,
    fraisPort: 5,
    coutTotal: 30,
    dateAchat: getDaysAgo(0), // Aujourd'hui
    plateforme: 'vinted',
    vendeur: 'Marie_fashion',
    compteVinted: '@vintage_pro',
    statut: 'recu',
    numeroSuivi: 'LA123456789',
    urlSuivi: 'https://laposte.fr/track/LA123456789',
    prixReventePrevu: 45,
    margeEstimee: 15,
    photo: '/images/jean-levis.jpg',
    notes: 'Très bon état, petite tache sur la poche',
    createdAt: getHoursAgo(5),
    updatedAt: getHoursAgo(2)
  },
  {
    id: '2',
    numeroTransaction: '#ACH-2026-002',
    nomArticle: 'Veste en cuir Zara',
    marque: 'Zara',
    taille: 'M',
    prixAchat: 35,
    fraisPort: 6,
    coutTotal: 41,
    dateAchat: getDaysAgo(0), // Aujourd'hui
    plateforme: 'leboncoin',
    vendeur: 'Paul_vintage',
    compteVinted: '@fashion_market',
    statut: 'expedie',
    numeroSuivi: 'FR987654321',
    urlSuivi: 'https://colissimo.fr/track/FR987654321',
    prixReventePrevu: 65,
    margeEstimee: 24,
    createdAt: getHoursAgo(3),
    updatedAt: getHoursAgo(1)
  },
  // Achats de cette semaine (semaine)
  {
    id: '3',
    numeroTransaction: '#ACH-2026-003',
    nomArticle: 'Robe H&M fleurie',
    marque: 'H&M',
    taille: '38',
    prixAchat: 12,
    fraisPort: 4,
    coutTotal: 16,
    dateAchat: getDaysAgo(2), // Il y a 2 jours
    plateforme: 'vide_grenier',
    compteVinted: '@vintage_pro',
    statut: 'en_stock',
    prixReventePrevu: 28,
    margeEstimee: 12,
    photo: '/images/robe-hm.jpg',
    createdAt: getHoursAgo(48),
    updatedAt: getHoursAgo(24)
  },
  {
    id: '4',
    numeroTransaction: '#ACH-2026-004',
    nomArticle: 'Baskets Nike Air Max',
    marque: 'Nike',
    taille: '42',
    prixAchat: 45,
    fraisPort: 7,
    coutTotal: 52,
    dateAchat: getDaysAgo(4), // Il y a 4 jours
    plateforme: 'vinted',
    vendeur: 'Sneakers_shop',
    compteVinted: '@sneakers_collector',
    statut: 'revendu',
    prixReventePrevu: 75,
    margeEstimee: 23,
    createdAt: getHoursAgo(96),
    updatedAt: getHoursAgo(72)
  },
  {
    id: '5',
    numeroTransaction: '#ACH-2026-005',
    nomArticle: 'Pull cachemire Uniqlo',
    marque: 'Uniqlo',
    taille: 'L',
    prixAchat: 18,
    fraisPort: 4,
    coutTotal: 22,
    dateAchat: getDaysAgo(6), // Il y a 6 jours
    plateforme: 'vinted',
    vendeur: 'Julie_mode',
    compteVinted: '@fashion_market',
    statut: 'en_attente',
    notes: "Commande passée, en attente d'expédition",
    prixReventePrevu: 35,
    margeEstimee: 13,
    createdAt: getHoursAgo(144),
    updatedAt: getHoursAgo(144)
  },
  // Achats de ce mois (mois)
  {
    id: '6',
    numeroTransaction: '#ACH-2026-006',
    nomArticle: 'Manteau long beige',
    marque: 'Mango',
    taille: 'S',
    prixAchat: 28,
    fraisPort: 5,
    coutTotal: 33,
    dateAchat: getDaysAgo(10), // Il y a 10 jours
    plateforme: 'vinted',
    vendeur: 'Sophie_chic',
    compteVinted: '@vintage_pro',
    statut: 'recu',
    numeroSuivi: 'LA987123456',
    urlSuivi: 'https://laposte.fr/track/LA987123456',
    prixReventePrevu: 55,
    margeEstimee: 22,
    notes: 'Excellent état, jamais porté',
    createdAt: getHoursAgo(240),
    updatedAt: getHoursAgo(200)
  },
  {
    id: '7',
    numeroTransaction: '#ACH-2026-007',
    nomArticle: 'Sac à main Coach',
    marque: 'Coach',
    taille: 'Unique',
    prixAchat: 65,
    fraisPort: 8,
    coutTotal: 73,
    dateAchat: getDaysAgo(15), // Il y a 15 jours
    plateforme: 'leboncoin',
    vendeur: 'Luxe_occasion',
    compteVinted: '@fashion_market',
    statut: 'en_stock',
    prixReventePrevu: 120,
    margeEstimee: 47,
    notes: 'Authentique, avec certificat',
    createdAt: getHoursAgo(360),
    updatedAt: getHoursAgo(300)
  },
  {
    id: '8',
    numeroTransaction: '#ACH-2026-008',
    nomArticle: 'Chemise Ralph Lauren',
    marque: 'Ralph Lauren',
    taille: 'M',
    prixAchat: 22,
    fraisPort: 4,
    coutTotal: 26,
    dateAchat: getDaysAgo(20), // Il y a 20 jours
    plateforme: 'vinted',
    vendeur: 'Thomas_style',
    compteVinted: '@sneakers_collector',
    statut: 'expedie',
    numeroSuivi: 'MR456789123',
    urlSuivi: 'https://mondialrelay.fr/track/MR456789123',
    prixReventePrevu: 42,
    margeEstimee: 16,
    createdAt: getHoursAgo(480),
    updatedAt: getHoursAgo(450)
  },
  // Achats de cette année (année)
  {
    id: '9',
    numeroTransaction: '#ACH-2026-009',
    nomArticle: 'Blouson Teddy Smith',
    marque: 'Teddy Smith',
    taille: 'L',
    prixAchat: 32,
    fraisPort: 6,
    coutTotal: 38,
    dateAchat: getDaysAgo(45), // Il y a 45 jours
    plateforme: 'vinted',
    vendeur: 'Sport_vintage',
    compteVinted: '@vintage_pro',
    statut: 'recu',
    prixReventePrevu: 58,
    margeEstimee: 20,
    createdAt: getHoursAgo(1080),
    updatedAt: getHoursAgo(1000)
  },
  {
    id: '10',
    numeroTransaction: '#ACH-2026-010',
    nomArticle: 'Montre Fossil',
    marque: 'Fossil',
    taille: 'Unique',
    prixAchat: 55,
    fraisPort: 5,
    coutTotal: 60,
    dateAchat: getDaysAgo(60), // Il y a 60 jours
    plateforme: 'leboncoin',
    vendeur: 'Watches_pro',
    compteVinted: '@fashion_market',
    statut: 'en_stock',
    prixReventePrevu: 95,
    margeEstimee: 35,
    createdAt: getHoursAgo(1440),
    updatedAt: getHoursAgo(1400)
  },
  {
    id: '11',
    numeroTransaction: '#ACH-2026-011',
    nomArticle: 'Jupe plissée Zara',
    marque: 'Zara',
    taille: '36',
    prixAchat: 15,
    fraisPort: 4,
    coutTotal: 19,
    dateAchat: getDaysAgo(90), // Il y a 90 jours
    plateforme: 'vinted',
    vendeur: 'Mode_femme',
    compteVinted: '@sneakers_collector',
    statut: 'revendu',
    prixReventePrevu: 32,
    margeEstimee: 13,
    createdAt: getHoursAgo(2160),
    updatedAt: getHoursAgo(2100)
  },
  {
    id: '12',
    numeroTransaction: '#ACH-2026-012',
    nomArticle: 'Sweat Nike vintage',
    marque: 'Nike',
    taille: 'XL',
    prixAchat: 28,
    fraisPort: 5,
    coutTotal: 33,
    dateAchat: getDaysAgo(120), // Il y a 120 jours
    plateforme: 'vide_grenier',
    compteVinted: '@vintage_pro',
    statut: 'en_stock',
    prixReventePrevu: 50,
    margeEstimee: 17,
    createdAt: getHoursAgo(2880),
    updatedAt: getHoursAgo(2800)
  },
  // Achats récents supplémentaires
  {
    id: '13',
    numeroTransaction: '#ACH-2026-013',
    nomArticle: 'Doudoune The North Face Nuptse',
    marque: 'The North Face',
    taille: 'L',
    prixAchat: 85,
    fraisPort: 8,
    coutTotal: 93,
    dateAchat: getDaysAgo(1),
    plateforme: 'vinted',
    vendeur: 'Outdoor_resell',
    compteVinted: '@vintage_pro',
    statut: 'en_attente',
    prixReventePrevu: 165,
    margeEstimee: 72,
    notes: 'Taille L, coloris noir, très bon état',
    createdAt: getHoursAgo(10),
    updatedAt: getHoursAgo(10)
  },
  {
    id: '14',
    numeroTransaction: '#ACH-2026-014',
    nomArticle: 'Sneakers New Balance 574',
    marque: 'New Balance',
    taille: '43',
    prixAchat: 38,
    fraisPort: 6,
    coutTotal: 44,
    dateAchat: getDaysAgo(3),
    plateforme: 'vinted',
    vendeur: 'Sport_collector',
    compteVinted: '@fashion_market',
    statut: 'expedie',
    numeroSuivi: 'VG00123456789',
    prixReventePrevu: 72,
    margeEstimee: 28,
    createdAt: getHoursAgo(72),
    updatedAt: getHoursAgo(24)
  },
  {
    id: '15',
    numeroTransaction: '#ACH-2026-015',
    nomArticle: 'Blazer Tommy Hilfiger',
    marque: 'Tommy Hilfiger',
    taille: 'M',
    prixAchat: 42,
    fraisPort: 6,
    coutTotal: 48,
    dateAchat: getDaysAgo(5),
    plateforme: 'leboncoin',
    vendeur: 'Clothes_pro',
    compteVinted: '@sneakers_collector',
    statut: 'recu',
    numeroSuivi: 'LA777888999',
    urlSuivi: 'https://laposte.fr/track/LA777888999',
    prixReventePrevu: 80,
    margeEstimee: 32,
    notes: 'Blazer navy, jamais porté avec étiquettes',
    createdAt: getHoursAgo(120),
    updatedAt: getHoursAgo(48)
  },
  {
    id: '16',
    numeroTransaction: '#ACH-2026-016',
    nomArticle: 'Sac à dos Eastpak',
    marque: 'Eastpak',
    taille: 'Unique',
    prixAchat: 22,
    fraisPort: 5,
    coutTotal: 27,
    dateAchat: getDaysAgo(8),
    plateforme: 'vinted',
    vendeur: 'Bags_market',
    compteVinted: '@vintage_pro',
    statut: 'en_stock',
    prixReventePrevu: 42,
    margeEstimee: 15,
    createdAt: getHoursAgo(192),
    updatedAt: getHoursAgo(168)
  },
  {
    id: '17',
    numeroTransaction: '#ACH-2026-017',
    nomArticle: 'Bottines Chelsea Zara',
    marque: 'Zara',
    taille: '38',
    prixAchat: 30,
    fraisPort: 6,
    coutTotal: 36,
    dateAchat: getDaysAgo(12),
    plateforme: 'vinted',
    vendeur: 'Shoes_collection',
    compteVinted: '@fashion_market',
    statut: 'revendu',
    prixReventePrevu: 58,
    margeEstimee: 22,
    createdAt: getHoursAgo(288),
    updatedAt: getHoursAgo(144)
  },
  {
    id: '18',
    numeroTransaction: '#ACH-2026-018',
    nomArticle: 'Casquette Carhartt',
    marque: 'Carhartt',
    taille: 'Unique',
    prixAchat: 18,
    fraisPort: 4,
    coutTotal: 22,
    dateAchat: getDaysAgo(25),
    plateforme: 'vide_grenier',
    compteVinted: '@sneakers_collector',
    statut: 'en_stock',
    prixReventePrevu: 38,
    margeEstimee: 16,
    notes: 'Modèle canvas beige, état neuf',
    createdAt: getHoursAgo(600),
    updatedAt: getHoursAgo(580)
  },
  {
    id: '19',
    numeroTransaction: '#ACH-2026-019',
    nomArticle: 'Veste Patagonia Retro-X',
    marque: 'Patagonia',
    taille: 'M',
    prixAchat: 72,
    fraisPort: 7,
    coutTotal: 79,
    dateAchat: getDaysAgo(30),
    plateforme: 'vinted',
    vendeur: 'Outdoor_chic',
    compteVinted: '@vintage_pro',
    statut: 'en_stock',
    prixReventePrevu: 140,
    margeEstimee: 61,
    notes: 'Polaire emblématique, coloris naturel',
    createdAt: getHoursAgo(720),
    updatedAt: getHoursAgo(700)
  },
  {
    id: '20',
    numeroTransaction: '#ACH-2026-020',
    nomArticle: 'Jean G-Star Raw 3301',
    marque: 'G-Star Raw',
    taille: '31',
    prixAchat: 26,
    fraisPort: 5,
    coutTotal: 31,
    dateAchat: getDaysAgo(50),
    plateforme: 'vinted',
    vendeur: 'Denim_lover',
    compteVinted: '@fashion_market',
    statut: 'litige',
    prixReventePrevu: 48,
    margeEstimee: 17,
    notes: 'Litige en cours : article reçu endommagé',
    createdAt: getHoursAgo(1200),
    updatedAt: getHoursAgo(400)
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
  revendu: 3,
  retourne: 0,
  litige: 1
}

/**
 * Fonction pour filtrer les achats par période temporelle
 */
export function filterAchatsByPeriod(achats: Achat[], period: 'day' | 'week' | 'month' | 'year'): Achat[] {
  const now = new Date()
  const startOfPeriod = new Date()

  switch (period) {
    case 'day':
      // Aujourd'hui (depuis minuit)
      startOfPeriod.setHours(0, 0, 0, 0)
      break
    case 'week':
      // 7 derniers jours
      startOfPeriod.setDate(now.getDate() - 7)
      break
    case 'month':
      // 30 derniers jours
      startOfPeriod.setDate(now.getDate() - 30)
      break
    case 'year':
      // 365 derniers jours
      startOfPeriod.setDate(now.getDate() - 365)
      break
  }

  return achats.filter(achat => {
    const achatDate = new Date(achat.dateAchat)
    return achatDate >= startOfPeriod
  })
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
    revendu: achats.filter(a => a.statut === 'revendu').length,
    retourne: achats.filter(a => a.statut === 'retourne').length,
    litige: achats.filter(a => a.statut === 'litige').length
  }
}
