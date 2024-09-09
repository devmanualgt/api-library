import { AuthGuard } from '../../../modules/auth/guards/auth.guard';
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
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../../../modules/auth/guards/roles.guard';
import { Roles } from '../../../modules/auth/decorators/roles.decorator';

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

  @Roles('ADMIN')
  @Get('search')
  public async search(
    @Query() query: Record<string, any>, // Captura todos los query params
  ) {
    const conditions = Object.entries(query).map(([key, value]) => ({
      key: key as keyof BookDTO,
      value,
    }));

    return await this.bookService.filterSearch(conditions);
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
