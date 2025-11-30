import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('seed-roles')
  seedRoles() {
    return this.authService.seedRoles();
  }

  @Post('assign-admin')
  assignAdminRole() {
    return this.authService.assignAdminRole();
  }

  // --- (نقطة الدخول الجديدة) ---
  @Post('seed-school-data')
  seedSchoolData() {
    return this.authService.seedSchoolData();
  }
}