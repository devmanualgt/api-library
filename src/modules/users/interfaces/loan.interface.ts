import { BookEntity } from '../../../modules/book/entities/book.entity';
import { UsersEntity } from '../entities/user.entity';

export interface ILoan {
  user: UsersEntity;
  book: BookEntity;
  returnDate: Date;
  loanTerminate: boolean;
}
