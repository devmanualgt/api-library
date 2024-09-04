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
import { PublicAccess } from 'src/modules/auth/decorators/public.decorator';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Post('create')
  public async create(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }

  @Roles('ADMIN')
  @Get('all')
  public async getAll() {
    return await this.userService.getUsers();
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

    return await this.userService.findByList(conditions);
  }

  @PublicAccess()
  @Get(':id')
  public async findUserById(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }

  @Roles('ADMIN')
  @Put('edit/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() body: UserUpdateDTO,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Roles('ADMIN')
  @Delete('delete/:id')
  public async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
