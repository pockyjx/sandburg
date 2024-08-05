import { Post } from '../../entity/post.entity';
import { PostDetailRespDto } from './post.detail.resp.dto';

export class PostListRespDto {
  lists: PostDetailRespDto[];

  static toDto(posts: Post[]) {
    return new PostListRespDto(PostDetailRespDto.toPostList(posts));
  }

  constructor(lists: PostDetailRespDto[]) {
    this.lists = lists;
  }
}
