import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../infrastructure/post.repository';
import { CategoryRepository } from '../infrastructure/category.repository';
import { CreatePostReqDto } from '../dto/req/create.post.req.dto';
import { MemberRepository } from '../../member/infrastructure/member.repository';
import { Role } from '../../member/entity/member.role';
import { UpdatePostReqDto } from '../dto/req/update.post.req.dto';
import { Post } from '../entity/post.entity';
import { PostDetailRespDto } from '../dto/resp/post.detail.resp.dto';
import { PostListRespDto } from '../dto/resp/post.list.resp.dto';

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
    if(member.role == Role.USER && category.writeRole == Role.ADMIN) {
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

  async getPostDetail(postId: number, memberRole: string){
    const post = await this.findPost(postId);
    if(!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', HttpStatus.NOT_FOUND);
    }

    const categoryRole = post.category.viewRole;
    if(memberRole != 'ADMIN' && categoryRole == 'ADMIN') {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    return PostDetailRespDto.toDto(post);
  }

  async getPostList(memberRole: string, categoryId?: number, search?: string) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.member', 'member')
      .leftJoin('post.category', 'category')
      .addSelect(['member.nickname', 'category.name', 'category.id']);

    if(memberRole != 'ADMIN') {
      query.andWhere('category.viewRole = "USER"');
    }

    if(categoryId != undefined) {
      const category = await this.findCategory(categoryId);
      if(!category || (category.viewRole == 'ADMIN' && memberRole != "ADMIN")) {
        throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
      }

      query.andWhere('post.categoryId = :categoryId', { categoryId });
    }

    if(search) {
      query.andWhere('(post.title like :search or post.content like :search)', {search: `%${search}%`})
    }

    return PostListRespDto.toDto(await query.getMany());
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
      .leftJoin('post.member', 'member')
      .leftJoin('post.category', 'category')
      .addSelect(['member.loginId', 'category.id', 'category.name', 'category.viewRole'])
      .where('post.id = :id', { id })
      .getOne()
  }
}
