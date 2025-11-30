// src/auth/roles.decorator.ts (المُصحح)
import { SetMetadata } from '@nestjs/common';

// --- **هذا هو الإصلاح الثاني** ---
// (تعريف الأدوار التي "زرعناها" في قاعدة البيانات)
export enum RoleName {
  DIRECTOR_GENERAL = 'DIRECTOR_GENERAL',
  CENTER_MANAGER = 'CENTER_MANAGER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  FINANCE_HEAD = 'FINANCE_HEAD',
  FINANCE_OFFICER = 'FINANCE_OFFICER',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}
// --- (نهاية الإصلاح) ---

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);