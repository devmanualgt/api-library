import { BaseEntity } from '../../../_global/entities/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IBook } from '../interfaces/book.interface';
import { UserLoanEntity } from '../../users/entities/loans.entity';

@Entity({ name: 'book' })
export class BookEntity extends BaseEntity implements IBook {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  isbn: string;

  @Column()
  publish_year: number;

  @Column()
  copies: number;

  @Column({ default: 0 })
  quantity: number;

  @Column()
  topics: string;

  @OneToMany(() => UserLoanEntity, (userBooks) => userBooks.book)
  usersOnBook: UserLoanEntity[];
}
