import { BaseEntity } from '../../../_global/entities/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IBook } from '../interfaces/book.interface';
import { UserBookEntity } from '../../../modules/users/entities/user-books.entity';

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

  @Column()
  quantity: number;

  @Column()
  topics: string;

  @OneToMany(() => UserBookEntity, (userBooks) => userBooks.book)
  usersLoades: UserBookEntity[];
}
