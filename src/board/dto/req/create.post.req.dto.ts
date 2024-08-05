import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Member } from '../../../member/entity/member.entity';
import { Category } from '../../entity/category.entity';
import { Post } from '../../entity/post.entity';

export class CreatePostReqDto {
  @ApiProperty({description: '게시판 id'})
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({description: '게시글 제목'})
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: '게시글 본문'})
  @IsNotEmpty()
  content: string;

  toEntity(category: Category, member: Member) {
    const post = new Post();

    post.title = this.title;
    post.category = category;
    post.member = member;
    post.content = this.content;

    return post;
  }
}