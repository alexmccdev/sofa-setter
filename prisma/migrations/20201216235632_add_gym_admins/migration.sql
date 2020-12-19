/*
  Warnings:

  - You are about to drop the `_GymToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE "_users" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    FOREIGN KEY ("A") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_gymAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    FOREIGN KEY ("A") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GymToUser";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "_users_AB_unique" ON "_users"("A", "B");

-- CreateIndex
CREATE INDEX "_users_B_index" ON "_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_gymAdmins_AB_unique" ON "_gymAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_gymAdmins_B_index" ON "_gymAdmins"("B");
