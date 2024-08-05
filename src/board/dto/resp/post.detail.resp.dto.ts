import { Post } from '../../entity/post.entity';

export class PostDetailRespDto {
  postId: number;
  title: string;
  content: string;
  createdAt: Date;
  nickname: string;
  categoryId: number;
  categoryName: string;

  static toDto(post: Post){
    const dto = new PostDetailRespDto();

    dto.postId = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = post.createdAt;
    dto.nickname = post.member.nickname;
    dto.categoryId = post.category.id;
    dto.categoryName = post.category.name;

    return dto;
  }

  static toPostList(posts: Post[]) {
    return posts.map(post => this.toDto(post));
  }
}