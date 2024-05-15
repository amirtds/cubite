/*
  Warnings:

  - You are about to drop the `_UserSites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserSites` DROP FOREIGN KEY `_UserSites_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserSites` DROP FOREIGN KEY `_UserSites_B_fkey`;

-- DropTable
DROP TABLE `_UserSites`;
