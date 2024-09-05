import { Injectable } from '@nestjs/common';
import { BookRepository } from '../repositories/book.repository';
import { BookDTO, UpdateBookDTO } from '../dto/book.dto';
import { BookEntity } from '../entities/book.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async createBook(createUserDto: BookDTO): Promise<BookEntity> {
    return this.bookRepository.create(createUserDto);
  }

  async getBooks(): Promise<BookEntity[]> {
    return this.bookRepository.findAll();
  }

  async getBookById(id: number): Promise<BookEntity> {
    return this.bookRepository.findOne(id);
  }

  async updateBook(
    id: number,
    updateUserDto: Partial<UpdateBookDTO>,
  ): Promise<{ updateResult: UpdateResult; updatedEntity?: BookEntity }> {
    return this.bookRepository.update(id, updateUserDto);
  }

  async deleteBook(id: number): Promise<DeleteResult> {
    return this.bookRepository.delete(id);
  }

  async findBy({ key, value }: { key: keyof BookDTO; value: any }) {
    return this.bookRepository.findBy({ key, value });
  }

  async findByList(conditions: { key: keyof BookDTO; value: any }[]) {
    return this.bookRepository.findByList(conditions);
  }
}
