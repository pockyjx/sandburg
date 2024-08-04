import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from './response.dto';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map(
        ({
          result,
          message = '요청이 성공적으로 완료되었습니다.',
          code = HttpStatus.OK,
        }) => {
          return new ApiResponse(result, message, code);
        }
      )
    );
  }
}