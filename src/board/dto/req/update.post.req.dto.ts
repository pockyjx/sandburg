import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostReqDto {
  @ApiProperty({description: '게시글 제목'})
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: '게시글 내용'})
  @IsNotEmpty()
  content: string;
}