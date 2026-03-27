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

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  // 🔥 UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  // 🔥 INTEREST
  @UseGuards(JwtAuthGuard)
  @Post('interest')
  updateInterest(@Req() req: any, @Body() body: any) {
    return this.authService.updateInterest(req.user.userId, body);
  }
}