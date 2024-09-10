import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../_global/repositories/base-repository';
import { UserLoanEntity } from '../entities/loans.entity';
import { BookRepository } from '../../../modules/book/repositories/book.repository';

@Injectable()
export class UserLoandRepository extends BaseRepository<UserLoanEntity> {
  constructor(
    @InjectRepository(UserLoanEntity)
    private readonly userLoandRepository: Repository<UserLoanEntity>,
    private readonly bookRepository: BookRepository,
  ) {
    super(userLoandRepository, [
      { alias: 'entity', relation: 'book' },
      { alias: 'entity', relation: 'user' },
    ]);
  }

  async findActiveLoan(
    userId: any,
    bookId: any,
  ): Promise<UserLoanEntity | null> {
    return this.userLoandRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
        loanTerminate: false,
      },
    });
  }

  async filterTerminated(terminate: boolean): Promise<UserLoanEntity[]> {
    return await this.userLoandRepository.find({
      where: {
        loanTerminate: terminate,
      },
      relations: ['book', 'user'],
    });
  }
}
