import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../infrastructure/member.repository';
import { SigininDtoReq } from '../dto/req/siginin.dto.req';
import { Member } from '../entity/member.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository) {}

  async createMember(dto: SigininDtoReq): Promise<Member> {
    if(await this.findByLoginId(dto.loginId)) {
      throw new HttpException('이미 사용중인 아이디입니다.', HttpStatus.BAD_REQUEST);
    }

    if(await this.findByEmail(dto.email)) {
      throw new HttpException('이미 사용중인 이메일입니다.', HttpStatus.BAD_REQUEST);

    }

    if(await this.findByNickname(dto.nickname)) {
      throw new HttpException('이미 사용중인 닉네임입니다.', HttpStatus.BAD_REQUEST);

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
