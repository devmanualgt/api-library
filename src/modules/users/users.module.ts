import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserBookEntity } from './entities/user-books.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UserBookEntity])],
  controllers: [UsersController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository, TypeOrmModule],
})
export class UsersModule {}
