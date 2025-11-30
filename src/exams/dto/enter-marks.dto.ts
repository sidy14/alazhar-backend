import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// تعريف شكل الدرجة الواحدة
class StudentMarkDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  score: number;
}

// تعريف القائمة الكاملة
export class EnterMarksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentMarkDto)
  marks: StudentMarkDto[];
}