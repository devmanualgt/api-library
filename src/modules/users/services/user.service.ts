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

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoadRepository: UserLoandRepository,
  ) {}

  async createUser(createUserDto: UserDTO): Promise<UsersEntity> {
    return await this.userRepository.create(createUserDto);
  }

  async getUsers(): Promise<any[]> {
    return await this.userRepository.findAllAgrup();
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

  async getUserByEmail(email: string): Promise<UsersEntity> {
    return await this.userRepository.findByEmail(email);
  }

  async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
    return this.userRepository.findBy({ key, value });
  }

  async findByList(conditions: { key: keyof UserDTO; value: any }[]) {
    return this.userRepository.findByList(conditions);
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
