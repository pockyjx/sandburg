import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BoardService } from '../application/board.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt/jwt.auth.guard';
import { CreatePostReqDto } from '../dto/create.post.req.dto';
import { Request } from 'express';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/post')
  @ApiOperation({summary: '게시글 등록'})
  @ApiBody({ type: CreatePostReqDto})
  @ApiBearerAuth('access-token')
  async createPost(@Body() dto: CreatePostReqDto, @Req() req: Request) {
    const member = req.user as {loginId: string}
    await this.boardService.createBoard(dto, member.loginId);

    return {
      result: null,
      message: '게시글이 등록되었습니다.'
    }
  }

}
