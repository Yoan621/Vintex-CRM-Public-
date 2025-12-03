import puppeteer, { Browser, Page } from 'puppeteer'
import { prisma } from '@/lib/db/prisma'

interface ArticleData {
  nom: string
  prix: number
  taille: string
  photoUrl: string
  articleUrl: string
  vintedId: string
  statut?: string
  marque?: string
  etat?: string
}

/**
 * Classe principale de scraping Vinted
 */
export class VintedScraper {
  private profileUrl: string
  private browser: Browser | null = null
  private page: Page | null = null

  constructor(profileUrl: string) {
    this.profileUrl = profileUrl
  }

  /**
   * Initialise le navigateur Puppeteer avec configuration anti-détection
   */
  async init() {
    console.log('🚀 Initialisation du navigateur...')

    this.browser = await puppeteer.launch({
      headless: true, // Mettre false pour voir le navigateur en action
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    })

    this.page = await this.browser.newPage()

    // User-Agent réaliste pour éviter détection bot
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Configuration viewport
    await this.page.setViewport({ width: 1920, height: 1080 })

    console.log('✅ Navigateur initialisé')
  }

  /**
   * ÉTAPE 1 : Scrape la page profil et récupère les URLs des articles
   */
  async getArticlesUrls(): Promise<string[]> {
    if (!this.page) throw new Error('Browser not initialized')

    console.log(`📄 Chargement du profil: ${this.profileUrl}`)

    try {
      await this.page.goto(this.profileUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Attendre que les articles soient chargés
      await this.page.waitForSelector('a[href*="/items/"]', { timeout: 15000 })

      console.log('⏬ Scroll pour charger tous les articles...')

      // Scroll automatique pour charger le contenu dynamique
      await this.autoScroll()

      // Petit délai pour s'assurer que tout est chargé
      await this.delay(2000)

      // Extraire les URLs des articles
      const urls = await this.page.$$eval('a[href*="/items/"]', (links) => {
        return links
          .map(link => (link as HTMLAnchorElement).href)
          .filter(href => href.includes('/items/') && !href.includes('#'))
      })

      // Dédupliquer les URLs
      const uniqueUrls = [...new Set(urls)]

      console.log(`✅ ${uniqueUrls.length} articles trouvés`)

      return uniqueUrls

    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error)
      throw error
    }
  }

  /**
   * ÉTAPE 2 : Scrape un article individuel avec les XPath fournis
   */
  async scrapeArticle(articleUrl: string): Promise<ArticleData | null> {
    if (!this.page) throw new Error('Browser not initialized')

    try {
      console.log(`   Scraping: ${articleUrl}`)

      await this.page.goto(articleUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Attendre que la page soit chargée
      await this.page.waitForSelector('h1', { timeout: 10000 })

      // Extraire le vintedId de l'URL
      const vintedId = articleUrl.match(/\/items\/(\d+)/)?.[1] || ''

      if (!vintedId) {
        console.warn(`   ⚠️  VintedId non trouvé dans l'URL: ${articleUrl}`)
        return null
      }

      // Extraire les données avec les XPath fournis
      const articleData = await this.page.evaluate((xpaths) => {
        /**
         * Fonction helper pour extraire un élément par XPath
         */
        function getElementByXPath(xpath: string): Element | null {
          try {
            const result = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            )
            return result.singleNodeValue as Element | null
          } catch (error) {
            console.error(`Erreur XPath: ${xpath}`, error)
            return null
          }
        }

        /**
         * Fonction helper pour extraire le texte d'un élément
         */
        function getTextByXPath(xpath: string): string {
          const element = getElementByXPath(xpath)
          return element?.textContent?.trim() || ''
        }

        // Nom du produit (XPath fourni)
        const nom = getTextByXPath(xpaths.nom)

        // Prix (XPath fourni + nettoyage)
        const prixText = getTextByXPath(xpaths.prix)
        const prix = parseFloat(
          prixText
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
        ) || 0

        // Taille (XPath fourni)
        const taille = getTextByXPath(xpaths.taille)

        // Photo (XPath fourni - extraire le src de l'image)
        const photoElement = getElementByXPath(xpaths.photo)
        let photoUrl = ''

        if (photoElement) {
          // Chercher l'image dans la figure
          const img = photoElement.querySelector('img')
          if (img) {
            photoUrl = img.src || img.getAttribute('data-src') || ''
          }
        }

        // Données supplémentaires (si disponibles)
        // Chercher le badge de statut
        let statut = 'en_vente'
        const badges = document.querySelectorAll('[class*="badge"], [class*="status"]')
        badges.forEach(badge => {
          const text = badge.textContent?.toLowerCase() || ''
          if (text.includes('réservé')) statut = 'reserve'
          if (text.includes('vendu')) statut = 'vendu'
        })

        // Chercher la marque dans les détails
        let marque = ''
        const marqueElement = Array.from(document.querySelectorAll('p, span, div')).find(
          el => el.textContent?.includes('Marque')
        )
        if (marqueElement) {
          marque = marqueElement.textContent?.split(':')[1]?.trim() || ''
        }

        // Chercher l'état
        let etat = ''
        const etatElement = Array.from(document.querySelectorAll('p, span, div')).find(
          el => el.textContent?.includes('État')
        )
        if (etatElement) {
          etat = etatElement.textContent?.split(':')[1]?.trim() || ''
        }

        return {
          nom,
          prix,
          taille,
          photoUrl,
          statut,
          marque,
          etat
        }
      }, {
        nom: '//*[@id="content"]/section/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div[1]/div[1]/h1',
        prix: '//*[@id="content"]/section/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div[2]/div[1]/div[1]/p',
        taille: '//*[@id="content"]/section/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div[1]/div[3]/div[3]/div/div[2]/span',
        photo: '//*[@id="content"]/section/section/div/figure[2]'
      })

      // Validation des données essentielles
      if (!articleData.nom || articleData.prix === 0) {
        console.warn(`   ⚠️  Données incomplètes pour: ${articleUrl}`)
        console.warn(`      Nom: "${articleData.nom}", Prix: ${articleData.prix}`)
        return null
      }

      console.log(`   ✅ "${articleData.nom}" - ${articleData.prix}€`)

      return {
        ...articleData,
        articleUrl,
        vintedId
      }

    } catch (error) {
      console.error(`   ❌ Erreur scraping article ${articleUrl}:`, error)
      return null
    }
  }

  /**
   * ÉTAPE 3 : Scrape tous les articles du profil
   */
  async scrapeAllArticles(limit?: number): Promise<ArticleData[]> {
    const urls = await this.getArticlesUrls()

    // Limiter le nombre d'articles pour les tests
    const urlsToScrape = limit ? urls.slice(0, limit) : urls

    console.log(`\n📦 Scraping de ${urlsToScrape.length} article(s)...\n`)

    const articles: ArticleData[] = []
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < urlsToScrape.length; i++) {
      const url = urlsToScrape[i]
      console.log(`[${i + 1}/${urlsToScrape.length}]`)

      const articleData = await this.scrapeArticle(url)

      if (articleData && articleData.nom) {
        articles.push(articleData)
        successCount++
      } else {
        errorCount++
      }

      // Délai aléatoire entre chaque requête (anti-détection)
      const delayMs = 1000 + Math.random() * 2000 // 1-3 secondes
      await this.delay(delayMs)
    }

    console.log(`\n✅ Scraping terminé: ${successCount} réussis, ${errorCount} échecs\n`)

    return articles
  }

  /**
   * Utilitaire : Auto-scroll pour charger le contenu dynamique
   */
  private async autoScroll() {
    if (!this.page) return

    await this.page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0
        const distance = 200
        const maxScrolls = 50 // Limite de scrolls pour éviter boucle infinie
        let scrollCount = 0

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          scrollCount++

          if (totalHeight >= scrollHeight || scrollCount >= maxScrolls) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })
  }

  /**
   * Utilitaire : Délai entre les requêtes
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Ferme le navigateur proprement
   */
  async close() {
    if (this.browser) {
      await this.browser.close()
      console.log('🔒 Navigateur fermé')
    }
  }
}

/**
 * FONCTION PRINCIPALE D'ORCHESTRATION
 * Synchronise les articles Vinted avec la base de données
 */
export async function syncVintedStock(profileUrl: string, testMode = false) {
  const startTime = Date.now()
  const scraper = new VintedScraper(profileUrl)

  try {
    await scraper.init()

    // Scraper tous les articles (ou limité en mode test)
    const limit = testMode ? 2 : undefined
    const articles = await scraper.scrapeAllArticles(limit)

    console.log(`\n💾 Sauvegarde dans la base de données...`)

    // Sauvegarder dans la base de données
    let nouveaux = 0
    let modifies = 0

    for (const article of articles) {
      const existing = await prisma.article.findUnique({
        where: { vintedId: article.vintedId }
      })

      if (existing) {
        // Mettre à jour si changement
        const hasChanges =
          existing.prix !== article.prix ||
          existing.nom !== article.nom ||
          existing.statut !== article.statut

        if (hasChanges) {
          await prisma.article.update({
            where: { id: existing.id },
            data: {
              nom: article.nom,
              prix: article.prix,
              taille: article.taille,
              photoUrl: article.photoUrl,
              statut: article.statut || 'en_vente',
              marque: article.marque,
              etat: article.etat,
              derniereSync: new Date()
            }
          })
          modifies++
          console.log(`   📝 Modifié: ${article.nom}`)
        }
      } else {
        // Créer nouvel article
        await prisma.article.create({
          data: {
            articleUrl: article.articleUrl,
            vintedId: article.vintedId,
            nom: article.nom,
            prix: article.prix,
            taille: article.taille,
            photoUrl: article.photoUrl,
            statut: article.statut || 'en_vente',
            marque: article.marque,
            etat: article.etat
          }
        })
        nouveaux++
        console.log(`   ✨ Nouveau: ${article.nom}`)
      }
    }

    // Marquer articles supprimés (articles en base non scrapés)
    if (!testMode) {
      const scrapedIds = articles.map(a => a.vintedId)
      const supprimes = await prisma.article.updateMany({
        where: {
          vintedId: { notIn: scrapedIds },
          estActif: true
        },
        data: {
          estActif: false,
          statut: 'vendu',
          derniereSync: new Date()
        }
      })

      console.log(`   🗑️  ${supprimes.count} article(s) marqué(s) comme vendu(s)`)
    }

    // Logger le scraping
    const duree = Math.round((Date.now() - startTime) / 1000)

    await prisma.scrapingLog.create({
      data: {
        statut: 'success',
        articlesNouveaux: nouveaux,
        articlesModifies: modifies,
        articlesSupprimes: testMode ? 0 : (await prisma.article.count({ where: { estActif: false } })),
        dureeSecondes: duree
      }
    })

    const result = {
      success: true,
      nouveaux,
      modifies,
      supprimes: testMode ? 0 : (await prisma.article.count({ where: { estActif: false } })),
      total: articles.length,
      duree
    }

    console.log(`\n✅ Synchronisation terminée en ${duree}s`)
    console.log(`   📊 ${nouveaux} nouveaux | ${modifies} modifiés | ${result.supprimes} supprimés`)

    return result

  } catch (error) {
    console.error('\n❌ Erreur scraping:', error)

    await prisma.scrapingLog.create({
      data: {
        statut: 'error',
        messageErreur: error instanceof Error ? error.message : 'Erreur inconnue',
        dureeSecondes: Math.round((Date.now() - startTime) / 1000)
      }
    })

    throw error

  } finally {
    await scraper.close()
  }
}
