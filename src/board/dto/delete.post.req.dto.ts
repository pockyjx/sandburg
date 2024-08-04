import { ApiProperty } from '@nestjs/swagger';

export class DeletePostReqDto {
  @ApiProperty({description: '삭제할 게시글 id 목록 (다중 삭제 가능)'})
  postIds: number[];
}