import { Module } from '@nestjs/common';
import { BoardController } from './presentation/board.controller';
import { BoardService } from './application/board.service';
import { TypeOrmExModule } from '../db/typeorm-ex.module';
import { PostRepository } from './infrastructure/post.repository';
import { CategoryRepository } from './infrastructure/category.repository';
import { MemberRepository } from '../member/infrastructure/member.repository';

@Module({
  imports:[
    TypeOrmExModule.forCustomRepository([PostRepository]),
    TypeOrmExModule.forCustomRepository([CategoryRepository]),
    TypeOrmExModule.forCustomRepository([MemberRepository])
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [TypeOrmExModule]
})
export class BoardModule {}
