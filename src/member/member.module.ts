import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { MemberRepository } from './infrastructure/member.repository';
import { TypeOrmExModule } from '../db/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MemberRepository])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmExModule]
})
export class MemberModule {}
