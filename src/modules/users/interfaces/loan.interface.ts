import { BookEntity } from '../../../modules/book/entities/book.entity';
import { UsersEntity } from '../entities/user.entity';

export interface ILoan {
  user: UsersEntity;
  book: BookEntity;
  loan_date: Date;
  return_date: Date;
}
