import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { BookDTO, UpdateBookDTO } from '../dto/book.dto';
import { BookService } from './../services/book.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() body: BookDTO) {
    return await this.bookService.createBook(body);
  }

  @Get()
  async getAll() {
    return await this.bookService.getBooks();
  }

  @Get(':id')
  async findUserById(@Param('id') id: number) {
    return await this.bookService.getBookById(id);
  }

  //@Roles('ADMIN')
  @Put(':id')
  public async updateBook(
    @Param('id') id: number,
    @Body() body: UpdateBookDTO,
  ) {
    return await this.bookService.updateBook(id, body);
  }

  //@Roles('ADMIN')
  @Delete(':id')
  public async deleteUser(@Param('id') id: number) {
    return await this.bookService.deleteBook(id);
  }
}
