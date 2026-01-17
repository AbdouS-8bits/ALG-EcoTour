/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `eco_tours` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `eco_tours` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `eco_tours` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `eco_tours` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationTokenExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `users` table. All the data in the column will be lost.
  - The `emailVerified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Itinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "TourImage" DROP CONSTRAINT "TourImage_tourId_fkey";

-- DropForeignKey
ALTER TABLE "admin_audit_logs" DROP CONSTRAINT "admin_audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_tourId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "eco_tours" DROP CONSTRAINT "eco_tours_categoryId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "paymentStatus",
DROP COLUMN "totalPrice",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "eco_tours" DROP COLUMN "categoryId",
DROP COLUMN "difficulty",
DROP COLUMN "duration",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerificationToken",
DROP COLUMN "emailVerificationTokenExpires",
DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpires",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpires",
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "verificationToken" TEXT,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Itinerary";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "TourImage";
