import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';
import {
  UserDTO,
  UserLoanBookDTO,
  UserReturnBookDTO,
  UserUpdateDTO,
} from '../dto/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserLoandRepository } from '../repositories/user.loan.repository';
import { ErrorManager } from 'src/util/error.manager';
import * as bcrypt from 'bcrypt';
import { BookService } from 'src/modules/book/services/book.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoadRepository: UserLoandRepository,
    private readonly bookService: BookService,
  ) {}

  async createUser(body: UserDTO): Promise<UsersEntity> {
    const userByUsername = await this.userRepository.findByElement({
      key: 'username',
      value: body.username,
    });
    const userByEmail = await this.userRepository.findByElement({
      key: 'email',
      value: body.email,
    });

    if (userByUsername || userByEmail) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'El usuario y/o correo ya existe',
      });
    }

    body.password = await bcrypt.hash(body.password, +process.env.HASH_SALT);

    return await this.userRepository.create(body);
  }

  async getUsers(): Promise<any[]> {
    const all = await this.userRepository.findAll();
    const agrup = all.map((user) => {
      const groupedLoans = {
        activeLoans: [],
        completedLoans: [],
      };

      // Si hay préstamos en booksOnLoan
      if (user.booksOnLoan.length > 0) {
        user.booksOnLoan.forEach((loan) => {
          if (loan.loanTerminate) {
            groupedLoans.completedLoans.push(loan);
          } else {
            groupedLoans.activeLoans.push(loan);
          }
        });
      }

      // Retornar el usuario con los préstamos agrupados
      const { booksOnLoan, ...restUser } = user; // Eliminar booksOnLoan

      return {
        ...restUser,
        loans: groupedLoans,
      };
    });

    return agrup;
  }

  async findByElement({ key, value }: { key: keyof UserDTO; value: any }) {
    return await this.userRepository.findByElement({ key, value });
  }

  async getUserById(id: number): Promise<UsersEntity> {
    return await this.userRepository.findOne(id);
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<UserUpdateDTO>,
  ): Promise<{ updateResult: UpdateResult; updatedEntity?: UsersEntity }> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async filterSearch(conditions: { key: keyof UserDTO; value: any }[]) {
    return this.userRepository.filterSearch(conditions);
  }

  async userLoadBook(body: UserLoanBookDTO) {
    try {
      // Verificar si el usuario ya tiene un préstamo activo del libro
      const existingLoan = await this.userLoadRepository.findActiveLoan(
        body.user,
        body.book,
      );
      if (existingLoan) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El usuario ya tiene un préstamo activo de este libro.',
        });
      }

      // Verificar si hay suficientes libros disponibles
      const currentBook = await this.bookService.getBookById(+body.book);
      if (currentBook.quantity < 1) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No hay suficientes libros disponibles',
        });
      }

      // Actualizar la cantidad de libros disponibles
      await this.bookService.decrementQuantityBook(+body.book);

      // Crear un nuevo préstamo
      const createdLoan = await this.userLoadRepository.create(body);

      return createdLoan;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async userRetunBook(body: UserReturnBookDTO) {
    try {
      const loan = await this.userLoadRepository.findOne(+body.loan_id);
      if (loan.loanTerminate) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El libro ya fue devuelto',
        });
      }

      loan.returnDate = new Date();
      loan.loanTerminate = true;

      // actualizar cantidad disponible del libro
      await this.bookService.incrementQuantityBook(+loan.book.id);

      return await this.userLoadRepository.update(body.loan_id, loan);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getLoansFilter(terminate: boolean) {
    try {
      const loans = await this.userLoadRepository.findAll();
      const filteredLoans = loans.filter(
        (loan) => loan.loanTerminate === terminate,
      );

      return filteredLoans;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getLoans() {
    return await this.userLoadRepository.findAll();
  }
}
