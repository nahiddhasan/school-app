-- CreateTable
CREATE TABLE "SliderImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "SliderImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SliderImage_schoolId_idx" ON "SliderImage"("schoolId");

-- AddForeignKey
ALTER TABLE "SliderImage" ADD CONSTRAINT "SliderImage_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
