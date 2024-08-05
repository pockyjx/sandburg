import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { Member } from '../../member/entity/member.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 50, nullable: false})
  title: string;

  @Column({type: 'longtext', nullable: false})
  content: string;

  @Column({type: 'timestamp', nullable: false})
  createdAt: Date;

  @ManyToOne(() => Member, (member) => member.post, {nullable: false})
  member: Member;

  @ManyToOne(() => Category, (category) => category.post, {nullable: false})
  category: Category;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date(Date.now());
  }
}