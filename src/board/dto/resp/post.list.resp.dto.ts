import { Post } from '../../entity/post.entity';

export class PostListRespDto {
  lists: List[];

  static toDto(posts: Post[]) {
    return new PostListRespDto(List.toPostList(posts));
  }

  constructor(lists: List[]) {
    this.lists = lists;
  }
}

export class List {
  postId: number;
  title: string;
  nickname: string;
  createdAt: Date;
  categoryId: number;
  categoryName: string;

  static toPostList(posts: Post[]) {
    return posts.map(post => new List(post));
  }

  constructor(post: Post) {
    this.postId = post.id;
    this.title = post.title;
    this.nickname = post.member.nickname;
    this.createdAt = post.createdAt;
    this.categoryId = post.category.id;
    this.categoryName = post.category.name;
  }
}