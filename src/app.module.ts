import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MemberModule } from './member/member.module';
import { join } from 'path';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.prod.env' : '.dev.env'
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true
    }),

    MemberModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
