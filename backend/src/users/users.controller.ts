import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  @Get('wallet')
  async getWalletBalance(@Request() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    return { balance: user?.walletBalance || 0 };
  }
}
