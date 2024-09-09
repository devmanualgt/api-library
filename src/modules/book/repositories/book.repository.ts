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

  async updateBookQuantity(book_id: number, change: number) {
    const book = await this.findOne(book_id);
    if (book) {
      return await this.bookRepository.update(book_id, {
        quantity: book.quantity + change,
      });
    }
  }

  async incrementQuantityBook(book_id) {
    return await this.updateBookQuantity(book_id, 1);
  }

  async decrementQuantityBook(book_id) {
    return await this.updateBookQuantity(book_id, -1);
  }
}
