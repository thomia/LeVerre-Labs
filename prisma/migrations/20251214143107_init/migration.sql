-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'BETA_TESTEUR',
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "entreprise" TEXT,
    "poste" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLogin" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "tache" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "operateur" TEXT,
    "notes" TEXT,
    "scores" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shareCode" TEXT,
    "settings" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "scenarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "factor_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "element" TEXT NOT NULL,
    "factorId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "weight" REAL NOT NULL DEFAULT 1.0,
    "min" INTEGER NOT NULL DEFAULT 0,
    "max" INTEGER NOT NULL DEFAULT 100,
    "description" TEXT,
    "userId" TEXT,
    "entreprise" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "analyses_userId_idx" ON "analyses"("userId");

-- CreateIndex
CREATE INDEX "analyses_createdAt_idx" ON "analyses"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_shareCode_key" ON "scenarios"("shareCode");

-- CreateIndex
CREATE INDEX "scenarios_userId_idx" ON "scenarios"("userId");

-- CreateIndex
CREATE INDEX "scenarios_shareCode_idx" ON "scenarios"("shareCode");

-- CreateIndex
CREATE INDEX "factor_configs_element_idx" ON "factor_configs"("element");

-- CreateIndex
CREATE INDEX "factor_configs_userId_idx" ON "factor_configs"("userId");

-- CreateIndex
CREATE INDEX "factor_configs_entreprise_idx" ON "factor_configs"("entreprise");

-- CreateIndex
CREATE UNIQUE INDEX "factor_configs_element_factorId_userId_key" ON "factor_configs"("element", "factorId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "factor_configs_element_factorId_entreprise_key" ON "factor_configs"("element", "factorId", "entreprise");
