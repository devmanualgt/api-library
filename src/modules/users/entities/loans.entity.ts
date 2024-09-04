import { BaseEntity } from '../../../_global/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersEntity } from './user.entity';
import { BookEntity } from '../../book/entities/book.entity';
import { ILoan } from '../interfaces/loan.interface';

@Entity({ name: 'loans' })
export class LoanEntity extends BaseEntity implements ILoan {
  @Column()
  loan_date: Date;

  @Column()
  return_date: Date;

  @ManyToOne(() => UsersEntity, (user) => user.booksLoades)
  user: UsersEntity;

  @ManyToOne(() => BookEntity, (book) => book.usersLoades)
  book: BookEntity;
}
