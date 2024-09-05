import { BaseEntity } from '../../../_global/entities/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { ROLES } from '../../../constants/roles';
import { Exclude } from 'class-transformer';
import { UserLoanEntity } from './loans.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(() => UserLoanEntity, (userBooks) => userBooks.user)
  booksOnLoan: UserLoanEntity[];
}
