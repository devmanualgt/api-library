import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../entities/base-entity';

export abstract class BaseRepository<T extends BaseEntity> {
  protected constructor(private readonly repository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<T> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  async update(id: string, updateEntityDto: any): Promise<T> {
    await this.repository.update(id, updateEntityDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
