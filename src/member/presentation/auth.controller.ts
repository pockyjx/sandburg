import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SigininDtoReq } from '../dto/req/siginin.dto.req';
import { Member } from '../entity/member.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({summary: '회원가입'})
  @ApiBody({ type: SigininDtoReq })
  async signup(@Body() dto: SigininDtoReq) {
    const member = await this.authService.createMember(dto);
    return {
      result: null,
      message: '회원가입이 완료되었습니다.'
    };
  }
}
