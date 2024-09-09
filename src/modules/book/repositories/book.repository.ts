import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../../_global/repositories/base-repository';
import { Repository } from 'typeorm';
import { BookEntity } from '../entities/book.entity';

@Injectable()
export class BookRepository extends BaseRepository<BookEntity> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {
    super(bookRepository, [
      { alias: 'entity', relation: 'usersOnBook' },
      { alias: 'usersOnBook', relation: 'user' },
    ]);
  }
}
