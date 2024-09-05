import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../_global/repositories/base-repository';
import { UserLoanEntity } from '../entities/loans.entity';
import { UserLoanBookDTO } from '../dto/user.dto';
import { ErrorManager } from 'src/util/error.manager';

@Injectable()
export class UserLoandRepository extends BaseRepository<UserLoanEntity> {
  constructor(
    @InjectRepository(UserLoanEntity)
    private readonly userLoandRepository: Repository<UserLoanEntity>,
  ) {
    super(userLoandRepository); // Llamar al constructor del repositorio base
  }

  async userLoadBook(body: UserLoanBookDTO) {
    try {
      return await this.userLoandRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
