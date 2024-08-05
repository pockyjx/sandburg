import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { Member } from '../entity/member.entity';
import { MemberService } from '../application/member.service';
import { JwtAuthGuard } from '../../common/jwt/jwt.auth.guard';
import { Request } from 'express';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Delete('/resign')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: '회원 탈퇴'})
  @ApiBearerAuth('access-token')
  async resign(@Req() req: Request) {
    const member = req.user as {loginId: string};
    await this.memberService.deleteMember(member.loginId);

    return {
      result: null,
      message: '회원 탈퇴가 완료되었습니다.'
    };
  }
}