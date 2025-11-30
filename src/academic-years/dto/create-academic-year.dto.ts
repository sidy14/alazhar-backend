import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAcademicYearDto {
  @IsString()
  @IsNotEmpty()
  name: string; // مثال: "2025-2026"

  @IsDateString() // للتأكد من أن التاريخ بتنسيق صحيح (ISO 8601)
  @IsNotEmpty()
  startDate: string; // تاريخ البداية

  @IsDateString()
  @IsNotEmpty()
  endDate: string; // تاريخ النهاية
}