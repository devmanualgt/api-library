import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/_global/repositories/base-repository';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/user.entity';
import { UserDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorManager } from 'src/util/error.manager';

@Injectable()
export class UserRepository extends BaseRepository<UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {
    super(userRepository); // Llamar al constructor del repositorio base
  }

  async create(body: UserDTO): Promise<UsersEntity> {
    try {
      body.password = await bcrypt.hash(body.password, +process.env.HASH_SALT);
      return this.userRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return this.userRepository.findOne({ where: { email } });
  }
}
