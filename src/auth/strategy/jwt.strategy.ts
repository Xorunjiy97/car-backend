import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/config/config.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.interface';
import { Request } from 'express';
import { fromCookieAuthAsBearer } from '../../utils/from-cookie-auth-as-bearer.util';
import { TokenTypeEnum } from '../types/token-type.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<Request>([
        fromCookieAuthAsBearer(TokenTypeEnum.ACCESS),
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.getJwtSecretKey,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
