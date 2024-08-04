import { Module } from '@nestjs/common';
import { JwtAccessStrategy } from './jwt/jwt.access.strategy';

@Module({
  imports: [],
  providers: [JwtAccessStrategy],
  exports: [JwtAccessStrategy]
})

export class CommonModule {}