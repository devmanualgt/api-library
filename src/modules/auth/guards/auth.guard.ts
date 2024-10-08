import { AuthService } from './../services/auth.service';
import { Reflector } from '@nestjs/core';
import { UserService } from './../../users/services/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PUBLIC_KEY } from '../../../constants/key-decorators';
import { Request } from 'express';
import { useToken } from '../../../util/use.token';
import { IUseToken } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const token = await this.authService.descrptoJWT(
      req.headers['authorization'],
    );
    //const token = req.headers['authorization'];
    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Token invalido');
    }

    const manageToken: IUseToken | string = useToken(token);
    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExprired) {
      throw new UnauthorizedException('Token expirado');
    }

    const { sub } = manageToken;
    const user = await this.userService.getUserById(+sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no valido');
    }

    req.idUser = user.id;
    req.roleUser = user.role;
    req.nameUser = user.username;
    return true;
  }
}
