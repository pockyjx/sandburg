import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../infrastructure/member.repository';
import { SignupReqDto } from '../dto/req/signup.req.dto';
import { Member } from '../entity/member.entity';
import { SigninReqDto } from '../dto/req/signin.req.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
    private readonly jwtService: JwtService
    ) {}

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

  async signin(dto: SigninReqDto): Promise<string> {
    const findMember = await this.findByLoginId(dto.loginId);
    if(!findMember) {
      throw new HttpException('아이디 혹은 비밀번호를 확인하세요.', HttpStatus.UNAUTHORIZED);
    }

    const validPassword = await bcrypt.compare(dto.password, findMember.password);
    if(!validPassword) {
      throw new HttpException('아이디 혹은 비밀번호를 확인하세요.', HttpStatus.UNAUTHORIZED);
    }

    return this.createAccessToken(findMember);
  }

  async findByLoginId(loginId: string) {
    return this.memberRepository.findOne({
      where: { loginId : loginId }
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

  createAccessToken(member: Member): string {
    return this.jwtService.sign(
      {
        loginId: member.loginId,
        role: member.role
      },
    {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.ACCESS_EXP
      }
    );
  }
}
