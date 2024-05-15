/*
  Warnings:

  - You are about to alter the column `role` on the `site_role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `site_role` MODIFY `role` ENUM('STUDENT', 'INSTRUCTIONAL_DESIGNER', 'MAINTAINER', 'ADMINISTRATOR') NOT NULL;
