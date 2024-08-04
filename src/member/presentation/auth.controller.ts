import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SignupReqDto } from '../dto/req/SignupReqDto';
import { Member } from '../entity/member.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({summary: '회원가입'})
  @ApiBody({ type: SignupReqDto })
  async signup(@Body() dto: SignupReqDto): Promise<Member> {
    return await this.authService.createMember(dto);
  }
}
