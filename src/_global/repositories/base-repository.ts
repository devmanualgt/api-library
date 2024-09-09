import {
  Repository,
  DeepPartial,
  UpdateResult,
  DeleteResult,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseEntity } from '../entities/base-entity';
import { ErrorManager } from '../..//util/error.manager';

type RelationConfig = {
  alias: string;
  relation: string;
};
export abstract class BaseRepository<T extends BaseEntity> {
  private joinRelations: RelationConfig[];

  protected constructor(
    private readonly repository: Repository<T>,
    joinRelations: RelationConfig[] = [], // Para relaciones complejas
  ) {
    this.joinRelations = joinRelations;
  }

  private applyJoins(queryBuilder: SelectQueryBuilder<T>) {
    this.joinRelations.forEach((join) => {
      queryBuilder.leftJoinAndSelect(
        `${join.alias}.${join.relation}`,
        join.relation,
      );
    });
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    try {
      const newEntity = this.repository.create(entity);
      if (!newEntity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Error al guardar el registro',
        });
      }
      return await this.repository.save(newEntity);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('entity');
      this.applyJoins(queryBuilder);
      queryBuilder.orderBy('entity.id', 'ASC');
      const tuplas: T[] = await queryBuilder.getMany();
      return tuplas;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('entity')
        .where('entity.id = :id', { id });
      this.applyJoins(queryBuilder);
      const tupla: T | undefined = await queryBuilder.getOne();
      if (!tupla) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró resultado',
        });
      }

      return tupla;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByElement({ key, value }: { key: keyof T; value: any }) {
    try {
      const search: BaseEntity = await this.repository
        .createQueryBuilder('entity')
        .where({ [key]: value })
        .getOne();
      return search;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async filterSearch(
    conditions: { key: keyof T; value: any }[],
  ): Promise<T[] | null> {
    try {
      const queryBuilder: SelectQueryBuilder<T> =
        this.repository.createQueryBuilder('entity');

      const metadata = this.repository.metadata;

      conditions.forEach((condition, index) => {
        let value = condition.value;
        const column = condition.key as string;

        const column_meta = metadata.columns.find(
          (col) => col.propertyName === column,
        );

        //console.log(column_meta.type.toString());

        // Verificar si el valor es string o number para usar LIKE o =
        if (column_meta.type.toString().includes('String')) {
          const likeValue = `%${value}%`;
          if (index === 0) {
            queryBuilder.where(`entity.${column} LIKE :value`, {
              value: likeValue,
            });
          } else {
            queryBuilder.orWhere(`entity.${column} LIKE :value`, {
              value: likeValue,
            });
          }
        } else if (column_meta.type.toString().includes('Number')) {
          value = value * 1;

          if (index === 0) {
            queryBuilder.where(`entity.${column} = CAST(${value} AS NUMERIC)`);
          } else {
            queryBuilder.orWhere(
              `entity.${column} = CAST(${value} AS NUMERIC)`,
            );
          }
        } else {
          console.log('nada');
        }
      });

      return await queryBuilder.getMany();
    } catch (error) {
      throw new Error(`Error in filterSearch: ${error.message}`);
      //throw ErrorManager.createSignatureError(error.message);
    }
  }

  async update(
    id: number,
    updateEntityDto: any,
  ): Promise<{ updateResult: UpdateResult; updatedEntity?: T }> {
    try {
      const updateResult: UpdateResult = await this.repository.update(
        id,
        updateEntityDto,
      );

      if (updateResult.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }

      const updatedEntity: T | undefined = await this.findOne(id);

      if (!updatedEntity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró la entidad actualizada',
        });
      }
      return { updateResult, updatedEntity };
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
