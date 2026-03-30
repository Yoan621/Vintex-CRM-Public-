import { NextResponse } from 'next/server'

/**
 * Vérifie si une API key est valide
 * @param apiKey - La clé API à vérifier
 * @returns true si la clé est valide, false sinon
 */
export async function verifyExtensionAuth(apiKey: string | null): Promise<boolean> {
  if (!apiKey) return false

  const validApiKey = process.env.EXTENSION_API_KEY

  if (!validApiKey) {
    console.error('⚠️ EXTENSION_API_KEY non définie dans .env.local')
    return false
  }

  return apiKey === validApiKey
}

/**
 * Middleware pour protéger les routes API de synchronisation
 * @param request - La requête HTTP
 * @param handler - Le handler de la route à protéger
 * @returns La réponse du handler ou une erreur 401
 */
export async function withExtensionAuth(
  request: Request,
  handler: (req: Request) => Promise<Response>
): Promise<Response> {
  const apiKey = request.headers.get('X-API-Key')

  if (!apiKey || !await verifyExtensionAuth(apiKey)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'API key invalide ou manquante' },
      { status: 401 }
    )
  }

  return handler(request)
}

// ───────────────────────────────────────────────────────────────────────────
// RATE LIMITING
// ───────────────────────────────────────────────────────────────────────────

interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

/**
 * Vérifie si une API key a dépassé la limite de requêtes
 * @param apiKey - La clé API
 * @param maxRequests - Nombre maximum de requêtes (défaut: 60)
 * @param windowMs - Fenêtre de temps en ms (défaut: 60000 = 1 minute)
 * @returns true si la limite n'est pas dépassée, false sinon
 */
export function rateLimit(
  apiKey: string,
  maxRequests = 60,
  windowMs = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(apiKey)

  if (!record || now > record.resetTime) {
    // Nouveau compteur ou reset
    rateLimitMap.set(apiKey, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    // Limite dépassée
    return false
  }

  // Incrémenter le compteur
  record.count++
  return true
}

/**
 * Middleware combinant authentification et rate limiting
 * @param request - La requête HTTP
 * @param handler - Le handler de la route à protéger
 * @param maxRequests - Nombre maximum de requêtes par minute
 * @returns La réponse du handler ou une erreur 401/429
 */
export async function withAuthAndRateLimit(
  request: Request,
  handler: (req: Request) => Promise<Response>,
  maxRequests = 60
): Promise<Response> {
  const apiKey = request.headers.get('X-API-Key')

  // Vérifier l'authentification
  if (!apiKey || !await verifyExtensionAuth(apiKey)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'API key invalide ou manquante' },
      { status: 401 }
    )
  }

  // Vérifier le rate limit
  if (!rateLimit(apiKey, maxRequests, 60000)) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Maximum ${maxRequests} requêtes par minute dépassé`
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60'
        }
      }
    )
  }

  return handler(request)
}

/**
 * Nettoie les anciens enregistrements de rate limit (à appeler périodiquement)
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now()

  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Nettoyage automatique toutes les 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000)
}
