/*
  Warnings:

  - A unique constraint covering the columns `[domainName]` on the table `sites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customDomain]` on the table `sites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `sites_domainName_key` ON `sites`(`domainName`);

-- CreateIndex
CREATE UNIQUE INDEX `sites_customDomain_key` ON `sites`(`customDomain`);
