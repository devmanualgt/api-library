import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/_global/repositories/base-repository';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {
    super(userRepository); // Llamar al constructor del repositorio base
  }

  // Aquí puedes agregar métodos específicos para UserEntity
  async findByEmail(email: string): Promise<UsersEntity> {
    return this.userRepository.findOne({ where: { email } });
  }
}
