import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import 'dotenv/config';
import * as process from 'node:process';
import { DataSource } from 'typeorm';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  migrationsTableName: 'typeorm_migrations',
  entities: ['src/**/*.entity.js'],
  migrations: ['./src/database/migrations/**/*.ts'],
};

console.log('config', config);

const dataSource = new DataSource(config);
export default dataSource;
