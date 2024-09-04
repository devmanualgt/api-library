import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDTO, UserUpdateDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  public async create(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }

  @Get('all')
  public async getAll() {
    return await this.userService.getUsers();
  }

  @Get(':id')
  public async findUserById(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }

  @Put('edit/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() body: UserUpdateDTO,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Delete('delete/:id')
  public async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
