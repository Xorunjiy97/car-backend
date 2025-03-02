import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponse } from '../auth/response/user.response';

@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@GetCurrentUserId() userId: number): Promise<UserResponse> {
    const user = await this.usersService.findOneById(userId);
    return new UserResponse(user);
  }
}
