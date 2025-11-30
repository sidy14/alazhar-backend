import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignTeacherDto {
  @IsNumber()
  @IsNotEmpty()
  teacherUserId: number; // رقم حساب الأستاذ

  @IsNumber()
  @IsNotEmpty()
  classroomId: number;   // رقم الفصل

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;     // رقم المادة

  @IsNumber()
  @IsNotEmpty()
  academicYearId: number; // السنة الدراسية
}