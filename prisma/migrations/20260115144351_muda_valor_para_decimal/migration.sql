/*
  Warnings:

  - You are about to alter the column `valor` on the `Gasto` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gasto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Gasto" ("categoria", "createdAt", "data", "id", "nome", "valor") SELECT "categoria", "createdAt", "data", "id", "nome", "valor" FROM "Gasto";
DROP TABLE "Gasto";
ALTER TABLE "new_Gasto" RENAME TO "Gasto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
