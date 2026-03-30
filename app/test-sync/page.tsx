'use client'

import { useState } from 'react'

const API_KEY = 'e65513ccb46dd85e64d1d630021831e63dd1ab87e516eb85cdec4baa674ec5bd'

export default function TestSyncPage() {
  const [results, setResults] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, method: 'GET' | 'POST', body?: any, useSync = true) => {
    setLoading(true)
    setResults('Chargement...')

    try {
      const url = useSync ? `/api/sync/${endpoint}` : `/api/${endpoint}`
      const response = await fetch(url, {
        method,
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      })

      const data = await response.json()

      setResults(JSON.stringify(data, null, 2))
    } catch (error) {
      setResults(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  const testVentes = () => {
    const sampleVente = {
      ventes: [
        {
          transactionNumber: `TEST-${Date.now()}`,
          articleName: 'Pull Nike Vintage',
          brandName: 'Nike',
          customerName: 'Jean Dupont',
          vintedAccount: 'mon-compte-vinted',
          salePrice: 25.00,
          purchasePrice: 10.00,
          profit: 15.00,
          saleDate: new Date().toISOString(),
          purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'validée'
        }
      ]
    }
    testAPI('ventes', 'POST', sampleVente)
  }

  const testAchats = () => {
    const sampleAchat = {
      achats: [
        {
          numeroTransaction: `ACHAT-${Date.now()}`,
          nomArticle: 'Veste Adidas',
          marque: 'Adidas',
          taille: 'M',
          prixAchat: 15.00,
          fraisPort: 3.50,
          coutTotal: 18.50,
          dateAchat: new Date().toISOString(),
          plateforme: 'vinted',
          compteVinted: 'mon-compte-vinted',
          statut: 'en_attente'
        }
      ]
    }
    testAPI('achats', 'POST', sampleAchat)
  }

  const testBoosts = () => {
    const sampleBoost = {
      boosts: [
        {
          date: new Date().toISOString(),
          article: 'Pull Nike Vintage',
          prix: 0.95,
          duration: '3j',
          dateExpiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'actif'
        }
      ]
    }
    testAPI('boosts', 'POST', sampleBoost)
  }

  const testArticles = () => {
    const sampleArticle = {
      articles: [
        {
          articleUrl: `https://www.vinted.fr/items/${Date.now()}`,
          vintedId: `${Date.now()}`,
          nom: 'T-shirt Zara',
          prix: 12.00,
          taille: 'S',
          photoUrl: 'https://via.placeholder.com/300',
          marque: 'Zara',
          etat: 'Bon état',
          nombreVues: 45,
          nombreLikes: 8,
          statut: 'en_vente',
          estActif: true
        }
      ]
    }
    testAPI('articles', 'POST', sampleArticle)
  }

  const testStatus = () => {
    testAPI('status', 'GET')
  }

  const getVentes = () => {
    testAPI('ventes', 'GET', undefined, false)
  }

  const getAchats = () => {
    testAPI('achats', 'GET', undefined, false)
  }

  const getBoosts = () => {
    testAPI('boosts', 'GET', undefined, false)
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🧪 Test des Routes API de Synchronisation
        </h1>

        <div className="bg-[#0E0E0E] border border-[#27272a] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">API Key utilisée :</h2>
          <code className="text-sm text-green-400 bg-black px-3 py-2 rounded block overflow-x-auto">
            {API_KEY}
          </code>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">📥 Routes de synchronisation (POST)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={testVentes}
              disabled={loading}
              className="bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📦 Sync Ventes
            </button>

            <button
              onClick={testAchats}
              disabled={loading}
              className="bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 Sync Achats
            </button>

            <button
              onClick={testBoosts}
              disabled={loading}
              className="bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚡ Sync Boosts
            </button>

            <button
              onClick={testArticles}
              disabled={loading}
              className="bg-gradient-to-r from-[#003CF3] to-[#0052CC] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              👕 Sync Articles
            </button>

            <button
              onClick={testStatus}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Voir Status
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">📤 Routes CRM (GET - Récupérer données)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={getVentes}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📦 GET Ventes
            </button>

            <button
              onClick={getAchats}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 GET Achats
            </button>

            <button
              onClick={getBoosts}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-[0_4px_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚡ GET Boosts
            </button>

            <button
              onClick={() => setResults('')}
              className="bg-[#18181b] border border-[#27272a] text-white px-6 py-4 rounded-xl font-semibold hover:border-[#003CF3]/40 transition-all"
            >
              🗑️ Effacer
            </button>
          </div>
        </div>

        <div className="bg-[#0E0E0E] border border-[#27272a] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Résultat :</h2>
          <pre className="text-sm text-green-400 bg-black px-4 py-3 rounded overflow-x-auto max-h-[600px] overflow-y-auto">
            {results || 'Cliquez sur un bouton pour tester une route API...'}
          </pre>
        </div>

        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">💡 Instructions</h3>
          <ul className="text-blue-200 space-y-2 text-sm">
            <li>1. Cliquez sur un bouton pour tester une route API</li>
            <li>2. Les données de test seront envoyées à l'API</li>
            <li>3. Le résultat s'affichera ci-dessus</li>
            <li>4. Vérifiez que <code className="bg-black px-2 py-1 rounded">success: true</code> apparaît</li>
            <li>5. Vous pouvez vérifier la base de données avec <code className="bg-black px-2 py-1 rounded">npx prisma studio</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
