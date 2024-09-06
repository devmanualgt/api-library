import { Module } from '@nestjs/common';
import { BookController } from './controllers/book.controller';
import { BookService } from './services/book.service';
import { BookRepository } from './repositories/book.repository';
import { BookEntity } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLoanEntity } from '../users/entities/loans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, UserLoanEntity])],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookService, BookRepository, TypeOrmModule],
})
export class BookModule {}
