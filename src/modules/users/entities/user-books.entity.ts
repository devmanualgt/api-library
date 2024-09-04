import { BaseEntity } from '../../../_global/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersEntity } from './user.entity';
import { BookEntity } from '../../../modules/book/entities/book.entity';

@Entity({ name: 'user_books' })
export class UserBookEntity extends BaseEntity {
  @ManyToOne(() => UsersEntity, (user) => user.booksLoades)
  user: UsersEntity;

  @ManyToOne(() => BookEntity, (book) => book.usersLoades)
  book: BookEntity;

  /* user_id (Foreign Key a Users)
book_id (Foreign Key a Books)
loan_date (Fecha en que se realiza el préstamo)
return_date */
}
