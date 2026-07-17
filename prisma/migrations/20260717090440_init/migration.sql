-- CreateEnum
CREATE TYPE "CropCategory" AS ENUM ('LEAFY_VEGETABLES', 'FRUITING_VEGETABLES', 'ROOT_CROPS', 'HIGH_VALUE_CROPS');

-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "contactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "cropCategory" "CropCategory" NOT NULL,
    "cropName" TEXT NOT NULL,
    "customCrop" TEXT,
    "plantingDate" DATE NOT NULL,
    "harvestDate" DATE NOT NULL,
    "farmSizeHectares" DECIMAL(8,2),
    "farmSizeSqm" DECIMAL(10,2),
    "gpsLat" DECIMAL(10,7),
    "gpsLng" DECIMAL(10,7),
    "photoUrl" TEXT,
    "issues" TEXT[],
    "pointsEarned" INTEGER NOT NULL DEFAULT 10,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LguUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LguUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_contactNumber_key" ON "Farmer"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_referenceNumber_key" ON "Submission"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LguUser_email_key" ON "LguUser"("email");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
