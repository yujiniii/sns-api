import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { typeORMConfig } from './config/typeorm.config';
import { BoardsModule } from './boards/boards.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(typeORMConfig),
    BoardsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
