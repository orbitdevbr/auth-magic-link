-- CreateTable
CREATE TABLE "UserMagic" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "UserMagic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMagic_email_key" ON "UserMagic"("email");
