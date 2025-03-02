import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { UserRepository } from '../users/repositories/user.repository';
import { AppConfigService } from '../config/config.service';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { AuthRefreshTokenService } from './services/auth-refresh-token.service';
import { PassportModule } from '@nestjs/passport';
import { TempSecretEntity } from './entity/temp-secret.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshTokenEntity, TempSecretEntity]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.getJwtSecretKey,
        signOptions: { expiresIn: appConfigService.getRefreshTokenTime },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthRefreshTokenService,
    JwtStrategy,
    JwtRefreshStrategy,
    UserRepository,
    RefreshTokenRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
