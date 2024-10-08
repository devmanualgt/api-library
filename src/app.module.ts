import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { DataSourceConfig } from './config/data.source';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      //load: [configurationDb, configurationAuth],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),

    UsersModule,

    AuthModule,

    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
