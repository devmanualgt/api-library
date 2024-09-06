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
      //return response(true, 'Registro guardado, correctamente', save);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('entity');

      // Aplicar relaciones complejas (joins)
      this.applyJoins(queryBuilder);
      queryBuilder.orderBy('entity.id', 'ASC');

      const tuplas: T[] = await queryBuilder.getMany();
      if (tuplas.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró resultado',
        });
      }
      // return response(true, 'Datos consultados correctamente', tuplas);
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

      // Aplicar relaciones complejas (joins)
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

      /* return response(true, 'Datos actualizados correctamente', {
        updateResult,
        updatedEntity,
      }); */
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

      //return response(true, 'Registro eliminado correctamente', tupla);
      return tupla;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
