import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../../users/entities';

import { RegisterDto } from '../dto/register.dto';
import { UserRepository } from '../../users/repositories/user.repository';
import { JwtPayload } from '../types/jwt-payload.interface';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { DataSource } from 'typeorm';

import { UserRoleEnum } from '../enums/user-role.enum';
import { compareHash, generateHash } from 'src/utils/bcrypt.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async register({ phone, password }: RegisterDto): Promise<{
    user: User;
    tokenPair: { access_token: string; refresh_token: string };
  }> {
    return this.dataSource.transaction(async (manager) => {
      const hashedPassword = await generateHash(password);

      const createdUser = manager.create(User, {
        phone,
        password: hashedPassword,
        role: UserRoleEnum.USER,
      });

      const user = await manager.save(createdUser);

      const payload: JwtPayload = {
        phone,
        role: UserRoleEnum.USER,
        sub: user.id,
      };

      const tokenPair =
        await this.authRefreshTokenService.generateTokenPair(payload);

      return { user, tokenPair };
    });
  }

  async refreshToken(refreshToken: string) {
    return await this.authRefreshTokenService.regenerateTokenPair(refreshToken);
  }

  async signIn({ phone, password }: AuthCredentialsDto) {
    const { user } = await this.validateUser(phone, password);

    const payload: JwtPayload = { phone, sub: user.id, role: user.role };
    const tokenPair =
      await this.authRefreshTokenService.generateTokenPair(payload);

    return { user, tokenPair };
  }

  async logout(id: number) {
    await this.authRefreshTokenService.logout(id);
  }

  private async validateUser(phone: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await compareHash(password, user.password);

    if (!isMatch) {
      throw new ConflictException('Invalid credentials');
    }

    return { isMatch, user };
  }
}
