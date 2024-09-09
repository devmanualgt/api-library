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

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoadRepository: UserLoandRepository,
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
    return await this.userLoadRepository.userLoadBook(body);
  }

  async userRetunBook(body: UserReturnBookDTO) {
    return await this.userLoadRepository.userReturnBook(body);
  }

  async getLoansFilter(terminate: boolean) {
    return await this.userLoadRepository.getLoansFilter(terminate);
  }

  async getLoans() {
    return await this.userLoadRepository.findAll();
  }
}
