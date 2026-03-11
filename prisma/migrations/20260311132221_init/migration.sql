-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleUrl" TEXT NOT NULL,
    "vintedId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "taille" TEXT,
    "photoUrl" TEXT,
    "marque" TEXT,
    "etat" TEXT,
    "description" TEXT,
    "nombreVues" INTEGER NOT NULL DEFAULT 0,
    "nombreLikes" INTEGER NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'en_vente',
    "estActif" BOOLEAN NOT NULL DEFAULT true,
    "dateAjout" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" DATETIME NOT NULL,
    "derniereSync" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionNumber" TEXT NOT NULL,
    "articleName" TEXT NOT NULL,
    "brandName" TEXT,
    "vintedAccount" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'non_traite',
    "saleDate" DATETIME NOT NULL,
    "purchaseDate" DATETIME,
    "purchasePrice" REAL NOT NULL,
    "salePrice" REAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ScrapingLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateExecution" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL,
    "articlesNouveaux" INTEGER NOT NULL DEFAULT 0,
    "articlesModifies" INTEGER NOT NULL DEFAULT 0,
    "articlesSupprimes" INTEGER NOT NULL DEFAULT 0,
    "dureeSecondes" INTEGER,
    "messageErreur" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_articleUrl_key" ON "Article"("articleUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Article_vintedId_key" ON "Article"("vintedId");

-- CreateIndex
CREATE INDEX "Article_statut_idx" ON "Article"("statut");

-- CreateIndex
CREATE INDEX "Article_vintedId_idx" ON "Article"("vintedId");

-- CreateIndex
CREATE UNIQUE INDEX "Vente_transactionNumber_key" ON "Vente"("transactionNumber");

-- CreateIndex
CREATE INDEX "Vente_status_idx" ON "Vente"("status");

-- CreateIndex
CREATE INDEX "Vente_vintedAccount_idx" ON "Vente"("vintedAccount");

-- CreateIndex
CREATE INDEX "ScrapingLog_dateExecution_idx" ON "ScrapingLog"("dateExecution");
