import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(e: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string | object;

    if(e instanceof HttpException) {
      status = e.getStatus();
      message = e.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = (e as Error).message || 'Unknown Error'
    }

    response.status(status).json({
      code: status,
      message,
      result: null
    });
  }
}