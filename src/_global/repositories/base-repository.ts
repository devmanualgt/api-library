import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { BaseEntity } from '../entities/base-entity';
import { ErrorManager } from '../..//util/error.manager';

export abstract class BaseRepository<T extends BaseEntity> {
  protected constructor(private readonly repository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async findAll(): Promise<T[]> {
    try {
      const tuplas: T[] = await this.repository.find();
      if (tuplas.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }
      return tuplas;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      const tupla: T = await this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
      });
      if (!tupla) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }

      return tupla;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async update(
    id: number,
    updateEntityDto: any,
  ): Promise<UpdateResult | undefined> {
    try {
      const tupla: UpdateResult = await this.repository.update(
        id,
        updateEntityDto,
      );

      if (tupla.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }

      return tupla;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async delete(id: number): Promise<DeleteResult | undefined> {
    try {
      const tupla: DeleteResult = await this.repository.delete(id);

      if (tupla.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }

      return tupla;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
