/*
  Warnings:

  - You are about to drop the column `desciption` on the `bookmarks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT;
