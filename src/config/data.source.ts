import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import configurationDb from './configuration-db';
import configurationAuth from './configuration-auth';

ConfigModule.forRoot({
  load: [configurationDb, configurationAuth],
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('HOST_DB'),
  port: configService.get('PORT_DB'),
  username: configService.get('USER_DB'),
  password: configService.get('PASSWORD_DB'),
  database: configService.get('DATABASE_DB'),
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  //åmigrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  migrationsRun: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: {
    rejectUnauthorized: false,
  },
};

//console.log(DataSourceConfig.migrations);

export const AppDS = new DataSource(DataSourceConfig);
