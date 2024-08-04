import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../infrastructure/member.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
  ) {}

  async deleteMember(loginId: string) {
    const result = await this.memberRepository.delete({loginId});
    if(result.affected == 0) {
      throw new HttpException('존재하지 않는 회원입니다.', HttpStatus.BAD_REQUEST);
    }
  }
}