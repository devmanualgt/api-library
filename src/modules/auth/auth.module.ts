import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../users/services/user.service';
import { UsersModule } from '../users/users.module';
import { UserRepository } from '../users/repositories/user.repository';
import { BookModule } from '../book/book.module';

@Global()
@Module({
  imports: [UsersModule, BookModule],
  providers: [AuthService, UserService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
