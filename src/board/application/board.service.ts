import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../infrastructure/post.repository';
import { CategoryRepository } from '../infrastructure/category.repository';
import { CreatePostReqDto } from '../dto/create.post.req.dto';
import { Member } from '../../member/entity/member.entity';
import { MemberRepository } from '../../member/infrastructure/member.repository';
import { Role } from '../../member/entity/member.role';

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

  async createBoard(dto: CreatePostReqDto, loginId: string) {
    const category = await this.findCategory(dto.categoryId);
    if(!category) {
      throw new HttpException('존재하지 않는 카테고리 입니다.', HttpStatus.BAD_REQUEST);
    }

    const member = await this.findMember(loginId);
    if(member.role == Role.USER && (category.name == 'notice'|| category.name == 'admin')) {
      throw new HttpException('잘못된 접근입니다.', HttpStatus.BAD_REQUEST);
    }

    const post = dto.toEntity(category, member);
    return await this.postRepository.save(post);
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
}
