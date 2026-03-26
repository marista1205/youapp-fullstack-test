import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================= REGISTER =================
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // ================= LOGIN =================
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  // ================= GET PROFILE =================
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  // ================= UPDATE PROFILE =================
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  // ================= ADD / UPDATE INTEREST =================
  @UseGuards(JwtAuthGuard)
  @Post('interest')
  addInterest(@Req() req: any, @Body() body: any) {
    return this.authService.addInterest(req.user.userId, body);
  }

  // ================= GET INTEREST =================
  @UseGuards(JwtAuthGuard)
  @Get('interest')
  getInterest(@Req() req: any) {
    return this.authService.getInterest(req.user.userId);
  }
}