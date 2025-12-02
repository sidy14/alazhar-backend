import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum StaffAccountType {
  STAFF = 'STAFF',
  TEACHER = 'TEACHER',
}

export class CreateStaffDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() @MinLength(8) password: string;
  @IsString() @IsNotEmpty() fullName: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() phoneNumber: string;
  
  @IsEnum(StaffAccountType) 
  @IsNotEmpty() 
  accountType: StaffAccountType; // النوع التقني

  @IsString() 
  @IsNotEmpty() 
  roleName: string; // <-- (جديد) المسمى الوظيفي للصلاحية

  @IsString() @IsNotEmpty() staffIdNumber: string;
  @IsString() @IsNotEmpty() jobTitle: string;
}