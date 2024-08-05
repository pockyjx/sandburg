import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Post } from '../entity/post.entity';

@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
}