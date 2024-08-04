import { DataSource, Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '../../db/typeorm-ex.decorator';

@CustomRepository(Member)
export class MemberRepository extends Repository<Member> {
}