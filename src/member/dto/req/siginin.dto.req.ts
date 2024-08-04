import { Role } from '../../entity/member.role';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, Max } from 'class-validator';

export class SigininDtoReq {
  @ApiProperty({description: '로그인 아이디'})
  @IsNotEmpty()
  loginId: string;

  @ApiProperty({description: '비밀번호 : 영 대/소문자 + 특수문자 포함 8~20자'})
  @Matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[~!@#$%^&*()])[A-Za-z\\d~!@#$%^&*()]{8,20}$")
  password: string;

  @ApiProperty({description: '이름'})
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: '닉네임'})
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({description: '전화번호'})
  @IsNotEmpty()
  phone: string;

  @ApiProperty({description: '이메일'})
  @IsEmail()
  email: string;

  @ApiProperty({description: '생년월일'})
  @IsNotEmpty()
  birth: Date;

  @ApiProperty({description: '성별 : 0(남), 1(여), 2(밝히지 않음)'})
  @IsNotEmpty()
  gender: number;

  @ApiProperty({description: '권한(USER/ADMIN)'})
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}