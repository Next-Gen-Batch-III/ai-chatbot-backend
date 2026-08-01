-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "chats_user_id_last_message_at_idx" ON "chats"("user_id", "last_message_at" DESC);
