import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtStrategy } from 'src/users/jwt.stretegy';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 30,
      },
    }),
  ],
  controllers: [BoardsController],
  providers: [UsersService, BoardsService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, TypeOrmModule],
})
export class BoardsModule {}
