import type { Boost } from '@/lib/types'

const daysAgo = (n: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const daysFromNow = (n: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

/**
 * Données de démonstration pour les boosts Vinted
 * Dates dynamiques relatives à aujourd'hui
 */
export const mockBoosts: Boost[] = [
  // ──── Actifs (en cours) ────
  {
    id: '1',
    date: daysAgo(1),
    article: "Jordan 1 Retro High OG",
    prix: 1.95,
    status: 'actif',
    dateExpiration: daysFromNow(6),
    duration: '7j',
  },
  {
    id: '2',
    date: daysAgo(2),
    article: 'Canada Goose Parka Expedition',
    prix: 1.95,
    status: 'actif',
    dateExpiration: daysFromNow(5),
    duration: '7j',
  },
  {
    id: '3',
    date: daysAgo(3),
    article: 'Nike Air Max 90 Triple White',
    prix: 0.95,
    status: 'actif',
    dateExpiration: daysFromNow(0),
    duration: '3j',
  },
  {
    id: '4',
    date: daysAgo(4),
    article: 'Balenciaga Triple S',
    prix: 0.95,
    status: 'actif',
    dateExpiration: daysFromNow(2),
    duration: '3j',
  },
  // ──── Expirés ce mois ────
  {
    id: '5',
    date: daysAgo(6),
    article: "Levi's 501 Jean Vintage",
    prix: 0.95,
    status: 'expiré',
    dateExpiration: daysAgo(3),
    duration: '3j',
  },
  {
    id: '6',
    date: daysAgo(9),
    article: 'The North Face Nuptse 700',
    prix: 1.95,
    status: 'expiré',
    dateExpiration: daysAgo(2),
    duration: '7j',
  },
  {
    id: '7',
    date: daysAgo(12),
    article: 'Adidas Stan Smith Vert',
    prix: 0.95,
    status: 'expiré',
    dateExpiration: daysAgo(9),
    duration: '3j',
  },
  {
    id: '8',
    date: daysAgo(14),
    article: 'Moncler Doudoune Maya',
    prix: 1.95,
    status: 'expiré',
    dateExpiration: daysAgo(7),
    duration: '7j',
  },
  {
    id: '9',
    date: daysAgo(18),
    article: 'Vans Old Skool Checkerboard',
    prix: 0.95,
    status: 'expiré',
    dateExpiration: daysAgo(15),
    duration: '3j',
  },
  // ──── Annulés ────
  {
    id: '10',
    date: daysAgo(20),
    article: 'Sac à main Guess',
    prix: 1.95,
    status: 'annulé',
    duration: '7j',
  },
  {
    id: '11',
    date: daysAgo(22),
    article: 'Pull H&M Oversize',
    prix: 0.95,
    status: 'annulé',
    duration: '3j',
  },
  // ──── Mois précédent ────
  {
    id: '12',
    date: daysAgo(35),
    article: 'Manteau The North Face',
    prix: 1.95,
    status: 'expiré',
    dateExpiration: daysAgo(28),
    duration: '7j',
  },
  {
    id: '13',
    date: daysAgo(38),
    article: 'Robe Mango Fleurie',
    prix: 0.95,
    status: 'expiré',
    dateExpiration: daysAgo(35),
    duration: '3j',
  },
  {
    id: '14',
    date: daysAgo(42),
    article: 'Baskets Vans Sk8-Hi',
    prix: 0.95,
    status: 'expiré',
    dateExpiration: daysAgo(39),
    duration: '3j',
  },
  {
    id: '15',
    date: daysAgo(45),
    article: 'Pantalon Zara Slim',
    prix: 1.95,
    status: 'expiré',
    dateExpiration: daysAgo(38),
    duration: '7j',
  },
]
