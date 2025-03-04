import { Body, Controller, Delete, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SignupReqDto } from '../dto/req/signup.req.dto';
import { Member } from '../entity/member.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SigninReqDto } from '../dto/req/signin.req.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../common/jwt/jwt.auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: 'password: 대+ 소문자 + 특수문자(~!@#$%^&*()) 포함 + 20자 / birth : YYYY-MM-DD / role : USER or ADMIN'
  })
  @ApiBody({ type: SignupReqDto })
  async signup(@Body() dto: SignupReqDto) {
    await this.authService.createMember(dto);

    return {
      result: null,
      message: '회원가입이 완료되었습니다.'
    };
  }

  @Post("/signin")
  @ApiOperation({summary: '로그인'})
  @ApiBody({type: SigninReqDto})
  async signin(@Body() dto: SigninReqDto,@Res() res: Response) {
    const accessToken = await this.authService.signin(dto);
    res.setHeader('Authorization', 'Bearer ' + accessToken);

    return res.status(HttpStatus.OK).json({
      result: {
        accessToken: accessToken
      },
      message: '로그인이 완료되었습니다.'
    });
  }
}
