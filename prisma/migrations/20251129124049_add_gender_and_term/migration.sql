-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SchoolTerm" AS ENUM ('FIRST_TERM', 'SECOND_TERM', 'THIRD_TERM');

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "term" "SchoolTerm" NOT NULL DEFAULT 'FIRST_TERM';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';
