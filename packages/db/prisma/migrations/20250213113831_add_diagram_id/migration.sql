/*
  Warnings:

  - Added the required column `diagramId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "diagramId" TEXT NOT NULL;
