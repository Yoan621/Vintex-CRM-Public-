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

-- CreateTable
CREATE TABLE "Vente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionNumber" TEXT NOT NULL,
    "vintedId" TEXT,
    "articleName" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "articleImage" TEXT,
    "purchasePrice" REAL NOT NULL DEFAULT 0,
    "salePrice" REAL NOT NULL,
    "profit" REAL NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "saleDate" DATETIME NOT NULL,
    "validationDate" DATETIME,
    "shippingDate" DATETIME,
    "cancellationDate" DATETIME,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "customerName" TEXT NOT NULL,
    "vintedAccount" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "invoice" TEXT,
    "shippingLabel" TEXT,
    "disputeReason" TEXT,
    "disputeDate" DATETIME,
    "disputeResolved" BOOLEAN NOT NULL DEFAULT false,
    "disputeAction" TEXT,
    "cancellationReason" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "archivedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncSource" TEXT NOT NULL DEFAULT 'extension'
);

-- CreateTable
CREATE TABLE "Achat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeroTransaction" TEXT NOT NULL,
    "vintedId" TEXT,
    "nomArticle" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "taille" TEXT NOT NULL,
    "photo" TEXT,
    "prixAchat" REAL NOT NULL,
    "fraisPort" REAL NOT NULL DEFAULT 0,
    "coutTotal" REAL NOT NULL,
    "prixReventePrevu" REAL,
    "margeEstimee" REAL NOT NULL DEFAULT 0,
    "dateAchat" DATETIME NOT NULL,
    "plateforme" TEXT NOT NULL DEFAULT 'vinted',
    "vendeur" TEXT,
    "compteVinted" TEXT NOT NULL,
    "numeroSuivi" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncSource" TEXT NOT NULL DEFAULT 'extension'
);

-- CreateTable
CREATE TABLE "Boost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "article" TEXT NOT NULL,
    "articleId" TEXT,
    "prix" REAL NOT NULL,
    "duration" TEXT NOT NULL,
    "dateExpiration" DATETIME,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncSource" TEXT NOT NULL DEFAULT 'extension'
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "syncType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "itemsProcessed" INTEGER NOT NULL DEFAULT 0,
    "itemsCreated" INTEGER NOT NULL DEFAULT 0,
    "itemsUpdated" INTEGER NOT NULL DEFAULT 0,
    "itemsDeleted" INTEGER NOT NULL DEFAULT 0,
    "itemsErrors" INTEGER NOT NULL DEFAULT 0,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "durationSeconds" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'extension',
    "errorMessage" TEXT,
    "errorDetails" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ExtensionConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKey" TEXT NOT NULL,
    "syncInterval" INTEGER NOT NULL DEFAULT 15,
    "autoSync" BOOLEAN NOT NULL DEFAULT true,
    "syncVentes" BOOLEAN NOT NULL DEFAULT true,
    "syncAchats" BOOLEAN NOT NULL DEFAULT true,
    "syncArticles" BOOLEAN NOT NULL DEFAULT true,
    "syncBoosts" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncVentes" DATETIME,
    "lastSyncAchats" DATETIME,
    "lastSyncArticles" DATETIME,
    "lastSyncBoosts" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
CREATE INDEX "ScrapingLog_dateExecution_idx" ON "ScrapingLog"("dateExecution");

-- CreateIndex
CREATE UNIQUE INDEX "Vente_transactionNumber_key" ON "Vente"("transactionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vente_vintedId_key" ON "Vente"("vintedId");

-- CreateIndex
CREATE INDEX "Vente_status_idx" ON "Vente"("status");

-- CreateIndex
CREATE INDEX "Vente_vintedAccount_idx" ON "Vente"("vintedAccount");

-- CreateIndex
CREATE INDEX "Vente_saleDate_idx" ON "Vente"("saleDate");

-- CreateIndex
CREATE INDEX "Vente_syncedAt_idx" ON "Vente"("syncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Achat_numeroTransaction_key" ON "Achat"("numeroTransaction");

-- CreateIndex
CREATE UNIQUE INDEX "Achat_vintedId_key" ON "Achat"("vintedId");

-- CreateIndex
CREATE INDEX "Achat_statut_idx" ON "Achat"("statut");

-- CreateIndex
CREATE INDEX "Achat_compteVinted_idx" ON "Achat"("compteVinted");

-- CreateIndex
CREATE INDEX "Achat_dateAchat_idx" ON "Achat"("dateAchat");

-- CreateIndex
CREATE INDEX "Achat_syncedAt_idx" ON "Achat"("syncedAt");

-- CreateIndex
CREATE INDEX "Boost_status_idx" ON "Boost"("status");

-- CreateIndex
CREATE INDEX "Boost_date_idx" ON "Boost"("date");

-- CreateIndex
CREATE INDEX "Boost_syncedAt_idx" ON "Boost"("syncedAt");

-- CreateIndex
CREATE INDEX "SyncLog_syncType_idx" ON "SyncLog"("syncType");

-- CreateIndex
CREATE INDEX "SyncLog_status_idx" ON "SyncLog"("status");

-- CreateIndex
CREATE INDEX "SyncLog_createdAt_idx" ON "SyncLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionConfig_apiKey_key" ON "ExtensionConfig"("apiKey");

-- CreateIndex
CREATE INDEX "ExtensionConfig_apiKey_idx" ON "ExtensionConfig"("apiKey");
