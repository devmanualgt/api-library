import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserLoanEntity } from './entities/loans.entity';
import { LoanController } from './controllers/loan.controller';
import { UserLoandRepository } from './repositories/user.loan.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UserLoanEntity])],
  controllers: [UsersController, LoanController],
  providers: [UserService, UserRepository, UserLoandRepository],
  exports: [UserService, UserRepository, UserLoandRepository, TypeOrmModule],
})
export class UsersModule {}
