import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        ...configService.defaultDatabaseOptions,
        synchronize: true,
        autoLoadEntities: true,
        cache: false,
        logging: 'all',
        logger: 'advanced-console',
        maxQueryExecutionTime: 1000,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsTableName: 'typeorm_migrations',
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
