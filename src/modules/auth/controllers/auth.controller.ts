import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDTO } from '../dto/auth.dto';
import { response } from 'src/util/response.manager';
import { ROLES } from 'src/constants/roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { username, password }: AuthDTO) {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );

    if (!userValidate) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    const jwt = await this.authService.generateJWT(userValidate);
    return jwt;
  }

  @Get('roles')
  getRoles(): { key: string; value: ROLES }[] {
    return response(true, 'Roles', [
      { key: 'Administrador', value: ROLES.ADMIN },
      { key: 'Cliente', value: ROLES.CLIENT },
    ]);
  }
}
