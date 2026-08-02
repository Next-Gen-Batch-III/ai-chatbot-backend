-- DropIndex
DROP INDEX "chats_user_id_last_message_at_idx";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "is_pinned" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "chats_user_id_is_pinned_last_message_at_idx" ON "chats"("user_id", "is_pinned", "last_message_at" DESC);
