import { UserService } from './../../users/services/user.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersEntity } from 'src/modules/users/entities/user.entity';
import { PayloadToken } from '../interfaces/auth.interface';
import { env } from 'process';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string) {
    const userByUsername = await this.userService.findBy({
      key: 'username',
      value: username,
    });
    const userByEmail = await this.userService.findBy({
      key: 'email',
      value: username,
    });

    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);
      if (match) {
        return userByUsername;
      }
    }

    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) {
        return userByEmail;
      }
    }

    return null;
  }

  singJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }) {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  async generateJWT(user: UsersEntity): Promise<any> {
    const getUser = await this.userService.getUserById(user.id);
    const payload: PayloadToken = {
      role: getUser.role,
      sub: getUser.id.toString(),
      username: getUser.username,
    };

    return {
      accessToken: this.singJWT({
        payload: payload,
        secret: process.env.SECRET_KEY_AUTH,
        expires: '1h',
      }),
      user,
    };
  }
}
