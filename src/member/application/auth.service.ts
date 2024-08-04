import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../infrastructure/member.repository';
import { SignupReqDto } from '../dto/req/SignupReqDto';
import { Member } from '../entity/member.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository) {}

  async createMember(dto: SignupReqDto): Promise<Member> {
    if(await this.findByLoginId(dto.loginId)) {
      throw new ConflictException('존재하는 아이디입니다.');
    }

    if(await this.findByEmail(dto.email)) {
      throw new ConflictException('존재하는 이메일입니다.');
    }

    if(await this.findByNickname(dto.nickname)) {
      throw new ConflictException('존재하는 닉네임입니다.')
    }

    const member = await this.memberRepository.create(dto);
    return await this.memberRepository.save(member);
  }

  async findByLoginId(loginId: string) {
    return this.memberRepository.findOne({
      where: { loginId }
    });
  }

  async findByNickname(nickname: string) {
    return this.memberRepository.findOne({
      where: { nickname }
    });
  }

  async findByEmail(email: string) {
    return await this.memberRepository.findOne({
      where: { email }
    });
  }
}
