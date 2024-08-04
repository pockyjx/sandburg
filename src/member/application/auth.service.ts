import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../infrastructure/member.repository';
import { SignupReqDto } from '../dto/req/signup.req.dto';
import { Member } from '../entity/member.entity';
import { SigninReqDto } from '../dto/req/signin.req.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository) {}

  async createMember(dto: SignupReqDto): Promise<Member> {
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

  async signin(dto: SigninReqDto) {
    const findMember = await this.memberRepository.findOne({
      where: { loginId: dto.loginId }
    });

    let validPassword = false;
    if(findMember) {
      validPassword = await bcrypt.compare(dto.password, findMember.password);
    }
    if(!findMember || !validPassword) {
      throw new HttpException('아이디 혹은 비밀번호를 확인하세요.', HttpStatus.UNAUTHORIZED);
    }

    return findMember;
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
