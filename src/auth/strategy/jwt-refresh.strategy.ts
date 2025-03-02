import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/config.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.interface';
import { fromCookieAuthAsBearer } from '../../utils/from-cookie-auth-as-bearer.util';
import { TokenTypeEnum } from '../types/token-type.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookieAuthAsBearer(TokenTypeEnum.REFRESH),
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.getRefreshJwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const potentialUser = await this.userRepository.findOneBy({
      id: payload.sub,
    });

    if (!potentialUser) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
