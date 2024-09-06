import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../modules/auth/guards/auth.guard';
import { RolesGuard } from '../../../modules/auth/guards/roles.guard';
import { UserService } from '../services/user.service';
import { UserLoanBookDTO, UserReturnBookDTO } from '../dto/user.dto';
import { response } from '../../../util/response.manager';

@Controller('users/loans')
@UseGuards(AuthGuard, RolesGuard)
export class LoanController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async loandBook(@Body() body: UserLoanBookDTO) {
    const loan = await this.userService.userLoadBook(body);
    return response(true, 'Prestamo del libro realizado', loan);
  }

  @Post('return')
  async returnBook(@Body() body: UserReturnBookDTO) {
    const ret = await this.userService.userRetunBook(body);
    return response(true, 'Libro devuelto', ret);
  }

  @Get('list')
  async getLoansFilter(@Query('terminate') terminate?: string) {
    let list;
    if (terminate) {
      const terminateBool = terminate === 'true';
      list = await this.userService.getLoansFilter(terminateBool);
    } else {
      list = await this.userService.getLoans();
    }
    return response(true, 'Prestamos', list);
  }
}
