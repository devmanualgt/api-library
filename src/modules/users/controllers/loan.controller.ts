import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../modules/auth/guards/auth.guard';
import { RolesGuard } from '../../../modules/auth/guards/roles.guard';
import { UserService } from '../services/user.service';
import { UserLoanBookDTO, UserReturnBookDTO } from '../dto/user.dto';

@Controller('users/loans')
@UseGuards(AuthGuard, RolesGuard)
export class LoanController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async loandBook(@Body() body: UserLoanBookDTO) {
    return await this.userService.userLoadBook(body);
  }

  @Post('return')
  async returnBook(@Body() body: UserReturnBookDTO) {
    return await this.userService.userRetunBook(body);
  }
}
