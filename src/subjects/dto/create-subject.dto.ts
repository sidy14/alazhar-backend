import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  nameAr: string; // مثال: اللغة العربية

  @IsString()
  @IsNotEmpty()
  nameFr: string; // مثال: Langue Arabe
  
  // (ملاحظة: تجاهلنا الوحدات حالياً للتبسيط)
}