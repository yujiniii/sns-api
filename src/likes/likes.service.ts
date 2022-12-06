import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/entities/board.entity';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    @InjectRepository(Board)
    private boardRepo: Repository<Board>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async click(id: number, getUser) {
    console.log(id, getUser);
    const user = await this.foundEmail(getUser.email);
    const board = await this.foundBoard(id);
    const like = await this.likeRepo
      .createQueryBuilder()
      .where('userId = :userId', { userId: user.userId })
      .orWhere('boardId =  :boardId', { boardId: board.boardId })
      .getOne();

    console.log(like);
    if (!like || typeof like === 'undefined') {
      console.log('좋아요 누름');
      await this.boardRepo
        .createQueryBuilder()
        .update()
        .set({ watchCount: () => 'likeCount+1' })
        .where('boardId = :boardId', { boardId: board.boardId })
        .execute();
      await this.likeRepo.save({ user, board });
      return { message: `${user.email}가 [${board.title}] 글에 좋아요 누름` };
    } else {
      console.log('좋아요 삭제');
      await this.boardRepo
        .createQueryBuilder()
        .update()
        .set({ watchCount: () => 'likeCount-1' })
        .where('boardId = :boardId', { boardId: board.boardId })
        .execute();
      await this.likeRepo.remove(like);
      return { message: `${user.email}가 [${board.title}] 글에 좋아요 삭제` };
    }
  }

  async foundEmail(email: string) {
    const user = await this.userRepo
      .findOne({
        where: { email: email },
      })
      .catch((err) => {
        console.log(err);
        throw new NotFoundException('사용자가 없습니다.');
      });
    if (!user || typeof user === 'undefined') {
      throw new NotFoundException(`사용자(${email})가 없습니다.`);
    } else {
      return user;
    }
  }

  async foundBoard(id: number) {
    console.log('in fn', id);
    const board = await this.boardRepo
      .findOne({ where: { boardId: id } })
      .catch((err) => {
        console.log(err);
        throw new NotFoundException('게시글이 없습니다.');
      });
    if (!board || typeof board === 'undefined') {
      throw new NotFoundException(`게시글(no.${id})이 없습니다.`);
    } else {
      return board;
    }
  }
}
