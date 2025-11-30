import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';

// 1. تعريف الفترات الدراسية
export enum SchoolTerm {
  FIRST_TERM = 'FIRST_TERM',
  SECOND_TERM = 'SECOND_TERM',
  THIRD_TERM = 'THIRD_TERM'
}

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  examDate: string;
  
  // 2. (هذا هو الحقل المفقود)
  @IsEnum(SchoolTerm)
  @IsNotEmpty()
  term: SchoolTerm;

  @IsNumber()
  @IsNotEmpty()
  maxScore: number;

  @IsNumber()
  @IsNotEmpty()
  classroomId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;

  @IsNumber()
  @IsNotEmpty()
  examTypeId: number;
}