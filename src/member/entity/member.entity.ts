import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './member.role';
import * as bcrypt from 'bcrypt';
import { Post } from '../../board/entity/post.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 20, unique: true, nullable: false})
  loginId: string;

  @Column({type: 'varchar', nullable: false})
  password: string;

  @Column({type: 'varchar', length: 20, nullable: false})
  name: string;

  @Column({type: 'varchar', length: 20, nullable: false})
  nickname: string;

  @Column({type: 'varchar', length: 20, nullable: false})
  phone: string;

  @Column({type: 'varchar', length: 50, nullable: false})
  email: string;

  @Column({type: 'date', nullable: false})
  birth: Date;

  @Column({type: 'tinyint', nullable: false})
  gender: number;

  @Column({type: 'timestamp', nullable: false})
  createdAt: Date;

  @Column({type: 'enum', enum: Role, nullable: false})
  role: Role;

  @OneToMany(() => Post, (post) => post.member)
  post: Post[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
    this.createdAt = new Date(Date.now());
  }
}