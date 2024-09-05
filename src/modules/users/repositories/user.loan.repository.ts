import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../_global/repositories/base-repository';
import { UserLoanEntity } from '../entities/loans.entity';
import { UserLoanBookDTO, UserReturnBookDTO } from '../dto/user.dto';
import { ErrorManager } from 'src/util/error.manager';
import { BookRepository } from 'src/modules/book/repositories/book.repository';
import { response } from 'src/util/response.manager';

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

  async userLoadBook(body: UserLoanBookDTO) {
    try {
      console.log(body.user);

      const existingLoan = await this.userLoandRepository.findOne({
        where: {
          user: { id: +body.user },
          book: { id: +body.book },
          loanTerminate: false,
        },
      });

      console.log(existingLoan);

      if (existingLoan) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El usuario ya tiene un préstamo activo de este libro.',
        });
      }

      const current_book = await this.bookRepository.findOne(+body.book);

      if (current_book.quantity < 1) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No hay suficientes libros disponibles',
        });
      }

      const updateUserDto = {
        quantity: current_book.quantity - 1,
      };

      await this.bookRepository.update(+body.book, updateUserDto);

      const create = await this.create(body);
      return response(true, 'Prestamo realizado.', create);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async userReturnBook(body: UserReturnBookDTO) {
    try {
      const loan = await this.findOne(body.loan_id);

      if (loan.loanTerminate) {
        throw new ErrorManager({
          type: 'NO_CONTENT',
          message: 'El libro ya fue devuelto',
        });
      }

      console.log(loan);

      loan.returnDate = new Date();
      loan.loanTerminate = true;

      const book = await this.bookRepository.findOne(+loan.book.id);
      if (book) {
        await this.bookRepository.update(+loan.book.id, {
          quantity: book.quantity + 1,
        });
      }

      await this.update(body.loan_id, loan);
      return response(true, 'Libro devuelto.');
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
