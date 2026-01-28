/**
 * Gestion des comptes Vinted
 * Liste dynamique des comptes utilisés pour le dropshipping
 */

export interface CompteVinted {
  id: string
  username: string
  createdAt: string
}

/**
 * Liste des comptes Vinted par défaut
 */
export const defaultComptes: CompteVinted[] = [
  {
    id: '1',
    username: '@vintage_pro',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    username: '@fashion_market',
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: '3',
    username: '@sneakers_collector',
    createdAt: new Date('2024-03-10').toISOString()
  }
]

/**
 * État global des comptes (en production, ce serait dans une base de données)
 */
let comptesVinted: CompteVinted[] = [...defaultComptes]

/**
 * Récupérer tous les comptes Vinted
 */
export function getComptesVinted(): CompteVinted[] {
  return comptesVinted
}

/**
 * Récupérer uniquement les usernames
 */
export function getComptesUsernames(): string[] {
  return comptesVinted.map(c => c.username)
}

/**
 * Ajouter un nouveau compte Vinted
 */
export function addCompteVinted(username: string): CompteVinted {
  const newCompte: CompteVinted = {
    id: Math.random().toString(36).substring(2, 11),
    username: username.startsWith('@') ? username : `@${username}`,
    createdAt: new Date().toISOString()
  }

  comptesVinted = [...comptesVinted, newCompte]
  return newCompte
}

/**
 * Supprimer un compte Vinted
 */
export function deleteCompteVinted(id: string): boolean {
  const initialLength = comptesVinted.length
  comptesVinted = comptesVinted.filter(c => c.id !== id)
  return comptesVinted.length < initialLength
}

/**
 * Vérifier si un username existe déjà
 */
export function compteExists(username: string): boolean {
  const normalizedUsername = username.startsWith('@') ? username : `@${username}`
  return comptesVinted.some(c => c.username === normalizedUsername)
}

/**
 * Réinitialiser aux comptes par défaut (utile pour le développement)
 */
export function resetComptes(): void {
  comptesVinted = [...defaultComptes]
}
