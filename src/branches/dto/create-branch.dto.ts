import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  nameAr: string; // اسم الفرع بالعربية (مثال: فرع يوف)

  @IsString()
  @IsNotEmpty()
  nameFr: string; // اسم الفرع بالفرنسية

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsNotEmpty()
  centerId: number; // <-- (مهم جداً) رقم المركز الذي يتبعه هذا الفرع
}