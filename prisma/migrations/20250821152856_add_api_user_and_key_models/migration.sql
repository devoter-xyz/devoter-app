-- CreateEnum
CREATE TYPE "ApiKeyStatus" AS ENUM ('ACTIVE', 'DISABLED', 'PENDING');

-- CreateTable
CREATE TABLE "ApiUser" (
    "id" TEXT NOT NULL,
    "walletAddress" VARCHAR(42) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalUsed" INTEGER NOT NULL DEFAULT 0,
    "status" "ApiKeyStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiUser_walletAddress_key" ON "ApiUser"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
