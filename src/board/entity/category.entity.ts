import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 20, nullable: false})
  name: string;

  @OneToMany(() => Post, (post) => post.category)
  post: Post[];
}