import { BaseEntity } from 'src/_global/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { IBook } from '../interfaces/book.interface';

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
}
