import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDTO, UserUpdateDTO } from '../dto/user.dto';
import { PublicAccess } from '../../../modules/auth/decorators/public.decorator';
import { AuthGuard } from '../../../modules/auth/guards/auth.guard';
import { RolesGuard } from '../../../modules/auth/guards/roles.guard';
import { Roles } from '../../../modules/auth/decorators/roles.decorator';
import { response } from '../../../util/response.manager';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // @Roles('ADMIN')
  @Post('')
  public async create(@Body() body: UserDTO) {
    const users = await this.userService.createUser(body);
    return response(true, 'Usuario creado correctamente', users);
  }

  @Roles('ADMIN')
  @Get('')
  public async getAll() {
    const users = await this.userService.getUsers();
    return response(true, 'Usuarios consultados correctamente', users);
  }

  @Roles('ADMIN')
  @Get('search')
  public async search(
    @Query() query: Record<string, any>, // Captura todos los query params
  ) {
    const conditions = Object.entries(query).map(([key, value]) => ({
      key: key as keyof UserDTO,
      value,
    }));

    const users = await this.userService.filterSearch(conditions);

    return response(true, 'Usuarios consultados correctamente', users);
  }

  @PublicAccess()
  @Get(':id')
  public async findUserById(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    return response(true, 'Usuario consultados correctamente', user);
  }

  @Roles('ADMIN')
  @Put(':id')
  public async updateUser(
    @Param('id') id: number,
    @Body() body: UserUpdateDTO,
  ) {
    const user = await this.userService.updateUser(id, body);

    return response(true, 'Usuario actualizado', user);
  }

  @Roles('ADMIN')
  @Delete(':id')
  public async deleteUser(@Param('id') id: number) {
    const user = await this.userService.deleteUser(id);
    return response(true, 'Usuario eliminado', user);
  }
}
