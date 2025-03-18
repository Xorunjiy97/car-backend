import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { JwtPayload } from '../types/jwt-payload.interface';
import { compareHash, generateHash } from '../../utils/bcrypt.util';

@Injectable()
export class AuthRefreshTokenService {
  private readonly rtSecret: string;
  private readonly rtSecretExpiredTime: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly appConfigService: AppConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    this.rtSecret = appConfigService.getRefreshJwtSecret;
    this.rtSecretExpiredTime = appConfigService.getRefreshTokenTime;
  }

  async generateTokenPair(
    { sub, role, phone }: JwtPayload,
    currentRefreshToken?: string,
  ) {
    const accessPayload = { sub, role, phone, type: 'access' };
    const refreshPayload = { sub, role, phone, type: 'refresh' };
    return {
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: await this.generateRefreshToken(
        refreshPayload,
        currentRefreshToken,
      ),
    };
  }

  async regenerateTokenPair(refreshToken: string) {
    const payload = (await this.jwtService.decode(refreshToken)) as JwtPayload;
    return this.generateTokenPair(payload, refreshToken);
  }

  async logout(userId: number) {
    await this.refreshTokenRepository.delete({ userId });
  }

  private async generateRefreshToken(
    payload: JwtPayload,
    currentRefreshToken?: string,
  ) {
    const refreshPayload = { ...payload, type: 'refresh' };
    const newRefreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.rtSecret,
      expiresIn: this.rtSecretExpiredTime,
    });

    if (currentRefreshToken) {
      const hasBeenValid = await this.isCurrentRtTokenValid(
        payload.sub,
        currentRefreshToken,
      );

      if (!hasBeenValid) {
        throw new UnauthorizedException('Refresh Token invalid');
      }
    }

    const hashedRefreshToken = await generateHash(newRefreshToken);

    await this.refreshTokenRepository.upsert(
      {
        refreshToken: hashedRefreshToken,
        userId: payload.sub,
        updated_at: new Date(),
      },
      { conflictPaths: ['userId'] },
    );

    return newRefreshToken;
  }


  private async isCurrentRtTokenValid(
    userId: number,
    currentRt: string,
  ): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      userId,
    });

    if (!refreshToken) {
      return false;
    }
    return await compareHash(currentRt, refreshToken.refreshToken);
  }
}
