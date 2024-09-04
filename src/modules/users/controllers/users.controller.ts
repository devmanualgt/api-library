import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  public async createProject(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }
}
