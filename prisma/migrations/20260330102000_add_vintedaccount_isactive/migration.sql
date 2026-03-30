-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExtensionConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiKey" TEXT NOT NULL,
    "vintedAccount" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_ExtensionConfig" ("apiKey", "autoSync", "createdAt", "id", "lastSyncAchats", "lastSyncArticles", "lastSyncBoosts", "lastSyncVentes", "syncAchats", "syncArticles", "syncBoosts", "syncInterval", "syncVentes", "updatedAt") SELECT "apiKey", "autoSync", "createdAt", "id", "lastSyncAchats", "lastSyncArticles", "lastSyncBoosts", "lastSyncVentes", "syncAchats", "syncArticles", "syncBoosts", "syncInterval", "syncVentes", "updatedAt" FROM "ExtensionConfig";
DROP TABLE "ExtensionConfig";
ALTER TABLE "new_ExtensionConfig" RENAME TO "ExtensionConfig";
CREATE UNIQUE INDEX "ExtensionConfig_apiKey_key" ON "ExtensionConfig"("apiKey");
CREATE INDEX "ExtensionConfig_apiKey_idx" ON "ExtensionConfig"("apiKey");
CREATE INDEX "ExtensionConfig_vintedAccount_idx" ON "ExtensionConfig"("vintedAccount");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
