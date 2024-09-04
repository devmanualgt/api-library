import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';
import { UserDTO, UserUpdateDTO } from '../dto/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: UserDTO): Promise<UsersEntity> {
    return this.userRepository.create(createUserDto);
  }

  async getUsers(): Promise<UsersEntity[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<UsersEntity> {
    return this.userRepository.findOne(id);
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<UserUpdateDTO>,
  ): Promise<UpdateResult | undefined> {
    return this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async getUserByEmail(email: string): Promise<UsersEntity> {
    return this.userRepository.findByEmail(email);
  }

  async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
    return this.userRepository.findBy({ key, value });
  }
}
