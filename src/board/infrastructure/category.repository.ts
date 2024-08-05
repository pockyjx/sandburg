import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';

@CustomRepository(Category)
export class CategoryRepository extends Repository<Category> {
}