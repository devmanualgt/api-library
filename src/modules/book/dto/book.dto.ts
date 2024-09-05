import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookDTO {
  @IsNotEmpty({ message: 'Titulo requerido' })
  @IsString({ message: 'string' })
  title: string;

  @IsNotEmpty({ message: 'Autor requerido' })
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsNumber()
  publish_year: number;

  @IsNotEmpty()
  @IsNumber()
  copies: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  topics: string;
}

export class UpdateBookDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  isbn: string;

  @IsOptional()
  @IsNumber()
  publish_year: number;

  @IsOptional()
  @IsNumber()
  copies: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  topics: string;
}
