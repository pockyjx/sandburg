import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BoardService } from '../application/board.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt/jwt.auth.guard';
import { CreatePostReqDto } from '../dto/req/create.post.req.dto';
import { Request } from 'express';
import { UpdatePostReqDto } from '../dto/req/update.post.req.dto';
import { OptionalJwtAuthGuard } from '../../common/jwt/optional.jwt.auth.guard';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/post')
  @ApiOperation({
    summary: '게시글 등록',
    description: 'categoryId - 1 (자유) : USER/ADMIN 작성 가능 + 2 (공지) & 3 (운영) : ADMIN만 작성 가능'
  })
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
  @ApiOperation({
    summary: '게시글 수정',
    description: '작성자 본인만 수정 가능'
  })
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
  @ApiOperation({
    summary: '게시글 삭제',
    description: '관리자 & 작성자 본인만 삭제 가능'
  })
  @ApiBearerAuth('access-token')
  async deletePost(@Param('postId') postId: number, @Req() req: Request) {
    const member = req.user as {loginId: string, role: string};
    await this.boardService.deletePost(postId, member.loginId, member.role);

    return {
      result: null,
      message: postId + '번 게시글이 삭제되었습니다.'
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/post/:postId')
  @ApiOperation({
    summary: '특정 게시글 상세 보기',
    description: 'categoryId - 1 (자유) & 2 (공지) : USER(비회원)/ADMIN 조회 가능 + 3 (운영) : ADMIN만 조회 가능'
  })
  @ApiBearerAuth('access-token')
  async getPostDetail(@Param('postId') postId: number, @Req() req: Request) {
    const member = req.user as {role: string};
    const role = member? member.role : null;

    const dto = await this.boardService.getPostDetail(postId, role);
    return {
      result: dto,
      message: postId +  '번 게시글을 조회하였습니다.'
    }
  }

  // @Get('/post/list') : list를 위 라우팅의 :postId로 인식해서 계속 위 API가 호출되는 문제 발생..
  @UseGuards(OptionalJwtAuthGuard)
  @Get('/list')
  @ApiOperation({
    summary: '게시글 목록 (카테고리 + 검색 필터링)',
    description: 'categoryId - 1 (자유) & 2 (공지) : USER(비회원)/ADMIN 조회 가능 + 3 (운영) : ADMIN만 조회 가능'
  })
  @ApiQuery({name: 'categoryId', required: false, description: '카테고리'})
  @ApiQuery({name: 'search', required: false, description: '검색어'})
  @ApiBearerAuth('access-token')
  async getPostList(@Req() req: Request,
                    @Query('search') search?: string,
                    @Query('categoryId') categoryId?: string,) {
    const member = req.user as {role: string};
    const role = member? member.role : null;

    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    const dto = await this.boardService.getPostList(role, parsedCategoryId, search);

    return {
      result: dto,
      message: '게시글 목록을 조회하였습니다.'
    }
  }
}
