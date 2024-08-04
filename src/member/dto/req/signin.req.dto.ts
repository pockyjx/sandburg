import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SigninReqDto {
  @ApiProperty({description: '로그인 id'})
  @IsNotEmpty()
  loginId: string;

  @ApiProperty({description: '비밀번호'})
  @IsNotEmpty()
  password: string;
}