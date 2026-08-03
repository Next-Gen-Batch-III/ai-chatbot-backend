CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "file_chunks" (
    "id" TEXT NOT NULL,
    "file_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),

    CONSTRAINT "file_chunks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_chunks" ADD CONSTRAINT "file_chunks_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;