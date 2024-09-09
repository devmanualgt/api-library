import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/user.entity';
import { UserDTO } from '../dto/user.dto';
import { ErrorManager } from '../../../util/error.manager';
import { BaseRepository } from '../../../_global/repositories/base-repository';

@Injectable()
export class UserRepository extends BaseRepository<UsersEntity> {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {
    super(userRepository, [
      { alias: 'entity', relation: 'booksOnLoan' },
      { alias: 'booksOnLoan', relation: 'book' },
    ]);
  }

  async findByElement({ key, value }: { key: keyof UserDTO; value: any }) {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
