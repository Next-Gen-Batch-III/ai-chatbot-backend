-- CreateTable
CREATE TABLE "allowed_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allowed_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "allowed_user_email_key" ON "allowed_user"("email");

-- CreateIndex
CREATE INDEX "allowed_user_email_idx" ON "allowed_user"("email");
