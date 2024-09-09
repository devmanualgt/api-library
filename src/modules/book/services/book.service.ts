import { Injectable } from '@nestjs/common';
import { BookRepository } from '../repositories/book.repository';
import { BookDTO, UpdateBookDTO } from '../dto/book.dto';
import { BookEntity } from '../entities/book.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async createBook(createUserDto: BookDTO): Promise<BookEntity> {
    return await this.bookRepository.create(createUserDto);
  }

  async getBooks(): Promise<BookEntity[]> {
    return await this.bookRepository.findAll();
  }

  async getBookById(id: number): Promise<BookEntity> {
    return await this.bookRepository.findOne(id);
  }

  async updateBook(
    id: number,
    updateUserDto: Partial<UpdateBookDTO>,
  ): Promise<{ updateResult: UpdateResult; updatedEntity?: BookEntity }> {
    return await this.bookRepository.update(id, updateUserDto);
  }

  async deleteBook(id: number): Promise<DeleteResult> {
    return await this.bookRepository.delete(id);
  }

  async findByElement({ key, value }: { key: keyof BookDTO; value: any }) {
    return await this.bookRepository.findByElement({ key, value });
  }

  async filterSearch(conditions: { key: keyof BookDTO; value: any }[]) {
    return await this.bookRepository.filterSearch(conditions);
  }

  async incrementQuantityBook(book_id) {
    return await this.bookRepository.updateBookQuantity(book_id, 1);
  }

  async decrementQuantityBook(book_id) {
    return await this.bookRepository.updateBookQuantity(book_id, -1);
  }
}
