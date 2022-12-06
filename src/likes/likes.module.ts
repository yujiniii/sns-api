import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Board } from 'src/boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../users/jwt.stretegy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Board, User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [LikesController],
  providers: [LikesService, JwtStrategy],
})
export class LikesModule {}
