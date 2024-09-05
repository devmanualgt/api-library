import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { response } from './response.manager';

export class ErrorManager extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type} :: ${message}`);
  }

  static createSignatureError(message: string) {
    const name = message.split(' :: ')[0];
    const final_message = message.split(' :: ')[1];
    if (name) {
      throw new HttpException(final_message, HttpStatus[name]);
    } else {
      throw new HttpException(final_message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Catch(UnauthorizedException, HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception['response']['message'] ||
      exception.message ||
      'Unexpected error';
    console.log(exception['response']['message']);

    res.status(status).json(
      response(false, message), // Usar la estructura response
    );
  }
}
