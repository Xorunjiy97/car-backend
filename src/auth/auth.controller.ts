import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from './decorators/can-be-public.decorator';
import { HttpStatusCode } from 'axios';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { setCookieUtil } from 'src/utils/set-cookie.util';
import { User } from 'src/users/entities';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: RegisterDto,
  ): Promise<{
    user: User;
  }> {
    const { user, tokenPair } = await this.authService.register({
      email: registerDto.email,
      password: registerDto.password,
    });
    setCookieUtil(res, tokenPair);
    return { user };
  }

  @Public()
  @ApiCookieAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatusCode.Accepted)
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { cookies } = req;
    const tokenPair = await this.authService.refreshToken(
      cookies.refresh_token,
    );

    setCookieUtil(res, tokenPair);
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { user, tokenPair } =
      await this.authService.signIn(authCredentialsDto);
    setCookieUtil(res, tokenPair);
    return user;
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatusCode.Accepted)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserId() id: number,
  ) {
    await this.authService.logout(id);
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'strict',
    });
  }
}
