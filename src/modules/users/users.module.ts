import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { LoanEntity } from './entities/loans.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, LoanEntity])],
  controllers: [UsersController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository, TypeOrmModule],
})
export class UsersModule {}
