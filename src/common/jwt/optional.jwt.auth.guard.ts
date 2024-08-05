import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const hasAuthHeader = request.headers.authorization;

    if (!hasAuthHeader) {
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}