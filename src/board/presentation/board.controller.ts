import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { BoardService } from '../application/board.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt/jwt.auth.guard';
import { CreatePostReqDto } from '../dto/req/create.post.req.dto';
import { Request } from 'express';
import { UpdateResult } from 'typeorm';
import { UpdatePostReqDto } from '../dto/req/update.post.req.dto';
import { PostDetailRespDto } from '../dto/resp/post.detail.resp.dto';

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
    await this.boardService.createPost(dto, member.loginId);

    return {
      result: null,
      message: '게시글이 등록되었습니다.'
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/post/:postId')
  @ApiOperation({summary: '게시글 수정'})
  @ApiBody({ type: UpdatePostReqDto})
  @ApiBearerAuth('access-token')
  async updatePost(@Body() dto: UpdatePostReqDto,
                   @Param('postId') postId: number,
                   @Req() req: Request) {
    const member = req.user as {loginId: string};
    await this.boardService.updatePost(dto, postId, member.loginId)

    return {
      result: null,
      message: "게시글이 수정되었습니다."
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/post/:postId')
  @ApiOperation({summary: '게시글 삭제'})
  @ApiBearerAuth('access-token')
  async deletePost(@Param('postId') postId: number, @Req() req: Request) {
    const member = req.user as {loginId: string, role: string};
    await this.boardService.deletePost(postId, member.loginId, member.role);

    return {
      result: null,
      message: postId + '번 게시글이 삭제되었습니다.'
    }
  }

  @Get('/post/:postId')
  @ApiOperation({summary: '특정 게시글 상세 보기'})
  async getPostDetail(@Param('postId') postId: number) {
    const dto = await this.boardService.getPostDetail(postId);
    return {
      result: dto,
      message: postId +  '번 게시글을 조회하였습니다.'
    }
  }

}
