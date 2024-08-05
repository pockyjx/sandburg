import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { Role } from '../../member/entity/member.role';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 20, nullable: false})
  name: string;

  @Column({type: 'enum', enum: Role, nullable: false})
  viewRole: Role;

  @Column({type: 'enum', enum: Role, nullable: false})
  writeRole: Role;

  @OneToMany(() => Post, (post) => post.category)
  post: Post[];
}