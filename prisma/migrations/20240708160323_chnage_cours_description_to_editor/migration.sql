/*
  Warnings:

  - You are about to alter the column `description` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Course` MODIFY `description` JSON NULL;
