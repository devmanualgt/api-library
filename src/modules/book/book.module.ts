import { Module } from '@nestjs/common';
import { BookController } from './controllers/book.controller';
import { BookService } from './services/book.service';
import { BookRepository } from './repositories/book.repository';
import { BookEntity } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserLoanEntity } from '../users/entities/loans.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, UserLoanEntity]),
    UsersModule,
  ],
  controllers: [BookController],
  providers: [BookService, BookRepository],
})
export class BookModule {}
