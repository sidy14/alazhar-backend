import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCenterDto {
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @IsString()
  @IsOptional() // (اختياري)
  address?: string;
}