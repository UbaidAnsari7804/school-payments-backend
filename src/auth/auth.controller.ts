import { Controller, Post, Body, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto.username, dto.password, dto.role);
      const obj = user.toObject();
      delete obj.password;
      return { user: obj };
    } catch (err: any) {
      throw new HttpException(err.message || 'Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto) {
    const validated = await this.authService.validateUser(dto.username, dto.password);
    if (!validated) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return this.authService.login(validated);
  }
}
