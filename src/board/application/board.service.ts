import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../infrastructure/post.repository';
import { CategoryRepository } from '../infrastructure/category.repository';
import { CreatePostReqDto } from '../dto/create.post.req.dto';
import { MemberRepository } from '../../member/infrastructure/member.repository';
import { Role } from '../../member/entity/member.role';
import { UpdatePostReqDto } from '../dto/update.post.req.dto';
import { Post } from '../entity/post.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,

    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,

    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository
  ) {}

  async createPost(dto: CreatePostReqDto, loginId: string) {
    const category = await this.findCategory(dto.categoryId);
    if(!category) {
      throw new HttpException('존재하지 않는 카테고리 입니다.', HttpStatus.NOT_FOUND);
    }

    const member = await this.findMember(loginId);
    if(member.role == Role.USER && (category.name == 'notice'|| category.name == 'admin')) {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    const post = dto.toEntity(category, member);
    return await this.postRepository.save(post);
  }

  async updatePost(dto: UpdatePostReqDto, postId: number, loginId: string) {
    const post = await this.findPost(postId);
    if(!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', HttpStatus.NOT_FOUND);
    }

    if(post.member.loginId != loginId) {
      throw new HttpException('작성자 본인만 수정 가능합니다.', HttpStatus.BAD_REQUEST);
    }

    return await this.postRepository.update(postId, {
      title: dto.title,
      content: dto.content
    });
  }

  async deletePost(postId: number, loginId: string, role: string) {
    let result = 0;
    const member = await this.findMember(loginId);

    if(!member) {
      throw new HttpException('존재하지 않는 회원입니다.', HttpStatus.NOT_FOUND)
    }

    if(role == "ADMIN") {
      result = (await this.postRepository.delete(postId)).affected;
    } else {
      result = (await this.postRepository
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :postId', { postId })
        .andWhere('memberId = :memberId', { memberId: member.id })
        .execute()).affected
    }

    if(result == 0) {
      throw new HttpException('삭제할 수 없습니다.', HttpStatus.BAD_REQUEST);
    }
  }

  async findCategory(id: number) {
    return await this.categoryRepository.findOne({
      where: { id: id }
    });
  }

  async findMember(loginId: string){
    return await this.memberRepository.findOne({
      where: { loginId: loginId }
    })
  }

  async findPost(id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.member', 'member')
      .where('post.id = :id', { id })
      .getOne()
  }
}
