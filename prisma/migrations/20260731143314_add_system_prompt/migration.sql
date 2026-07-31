-- CreateTable
CREATE TABLE "system_prompts" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_prompts_pkey" PRIMARY KEY ("id")
);
