/*
  Warnings:

  - A unique constraint covering the columns `[userId,repositoryId,week]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_userId_repositoryId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_repositoryId_week_key" ON "Vote"("userId", "repositoryId", "week");
