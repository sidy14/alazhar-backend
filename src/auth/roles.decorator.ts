import { SetMetadata } from '@nestjs/common';

// تعريف قائمة الأدوار المسموح بها في النظام (تطابق قاعدة البيانات)
export enum RoleName {
  DIRECTOR_GENERAL = 'DIRECTOR_GENERAL',
  FINANCE_HEAD = 'FINANCE_HEAD', // (جديد)
  CENTER_MANAGER = 'CENTER_MANAGER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  REGISTRATION_OFFICER = 'REGISTRATION_OFFICER', // (جديد) المراقب
  FINANCE_OFFICER = 'FINANCE_OFFICER',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);