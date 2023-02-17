/*
  Warnings:

  - You are about to drop the column `accepted_at` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `accepted_by` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_accepted_by_fkey";

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "accepted_at",
DROP COLUMN "accepted_by";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "AdminRole";
