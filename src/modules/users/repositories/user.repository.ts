import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/user.entity';
import { UserDTO } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorManager } from '../../../util/error.manager';
import { BaseRepository } from '../../../_global/repositories/base-repository';

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
      const userByUsername = await this.findBy({
        key: 'username',
        value: body.username,
      });
      const userByEmail = await this.findBy({
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
      return this.userRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
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

  async findByList(
    conditions: { key: keyof UserDTO; value: any }[],
  ): Promise<UsersEntity[] | null> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password');

      conditions.forEach((condition, index) => {
        const value = condition.value;

        // Verificar si el campo es de tipo string para usar LIKE, si no, usar igualdad
        const isStringColumn = [
          'firstName',
          'lastName',
          'email',
          'username',
        ].includes(condition.key as string);

        if (isStringColumn) {
          const likeValue = `%${value}%`;
          if (index === 0) {
            queryBuilder.where(`${condition.key} LIKE :value`, {
              value: likeValue,
            });
          } else {
            queryBuilder.orWhere(`${condition.key} LIKE :value`, {
              value: likeValue,
            });
          }
        } else {
          if (index === 0) {
            queryBuilder.where(`${condition.key} = :value`, { value });
          } else {
            queryBuilder.orWhere(`${condition.key} = :value`, { value });
          }
        }
      });

      const users = await queryBuilder.getMany();
      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
