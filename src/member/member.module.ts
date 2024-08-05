import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { MemberRepository } from './infrastructure/member.repository';
import { TypeOrmExModule } from '../db/typeorm-ex.module';
import { JwtModule } from '@nestjs/jwt';
import { MemberController } from './presentation/member.controller';
import { MemberService } from './application/member.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MemberRepository]),
    JwtModule.register({})],
  controllers: [AuthController, MemberController],
  providers: [AuthService, MemberService],
  exports: [TypeOrmExModule]
})
export class MemberModule {}
