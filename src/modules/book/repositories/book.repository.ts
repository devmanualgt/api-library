import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../../_global/repositories/base-repository';
import { Repository } from 'typeorm';
import { ErrorManager } from '../../../util/error.manager';
import { BookEntity } from '../entities/book.entity';
import { BookDTO } from '../dto/book.dto';

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

  async findBy({ key, value }: { key: keyof BookDTO; value: any }) {
    try {
      const book: BookEntity = await this.bookRepository
        .createQueryBuilder('book')
        .where({ [key]: value })
        .getOne();
      return book;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByList(
    conditions: { key: keyof BookDTO; value: any }[],
  ): Promise<BookEntity[] | null> {
    try {
      const queryBuilder = this.bookRepository.createQueryBuilder('book');

      conditions.forEach((condition, index) => {
        const likeValue = `%${condition.value}%`;
        if (index === 0) {
          queryBuilder.where(`${condition.key} LIKE :value`, {
            value: likeValue,
          });
        } else {
          queryBuilder.orWhere(`${condition.key} LIKE :value`, {
            value: likeValue,
          });
        }
      });

      const users = await queryBuilder.getMany();
      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
