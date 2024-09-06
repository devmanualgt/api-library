import { BaseEntity } from '../../../_global/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersEntity } from './user.entity';
import { BookEntity } from '../../book/entities/book.entity';
import { ILoan } from '../interfaces/loan.interface';

@Entity({ name: 'loans' })
export class UserLoanEntity extends BaseEntity implements ILoan {
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  returnDate: Date | null;

  @Column({ default: false }) // Para gestionar si se han entregado todos los libros prestados
  loanTerminate: boolean;

  @ManyToOne(() => UsersEntity, (user) => user.booksOnLoan)
  user: UsersEntity;

  @ManyToOne(() => BookEntity, (book) => book.usersOnBook)
  book: BookEntity;
}
