// src/auth/roles.guard.ts (المُصحح)
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName, ROLES_KEY } from './roles.decorator'; // <-- **هذا هو الإصلاح الثالث**

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // قارن "صلاحيات" المستخدم (assignments) مع "الأدوار المطلوبة" (requiredRoles)
    return requiredRoles.some((role) =>
      user.assignments?.some((assignment) => assignment.role === role),
    );
  }
}