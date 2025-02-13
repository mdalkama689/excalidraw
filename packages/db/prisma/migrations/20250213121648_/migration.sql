/*
  Warnings:

  - A unique constraint covering the columns `[diagramId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_diagramId_key" ON "Chat"("diagramId");
