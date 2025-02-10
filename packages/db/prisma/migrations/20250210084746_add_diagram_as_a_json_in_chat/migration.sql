/*
  Warnings:

  - Added the required column `diagram` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "diagram" JSONB NOT NULL,
ALTER COLUMN "text" DROP NOT NULL;
