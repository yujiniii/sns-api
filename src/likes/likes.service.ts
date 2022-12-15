import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/entities/board.entity';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LikesService {
  private readonly logger: Logger = new Logger(LikesService.name);

  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    @InjectRepository(Board)
    private boardRepo: Repository<Board>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async click(id: number, getUser) {
    const user = await this.foundEmail(getUser.email);
    const board = await this.foundBoard(id);
    const like = await this.likeRepo
      .createQueryBuilder()
      .where('userId = :userId', { userId: user.userId })
      .orWhere('boardId =  :boardId', { boardId: board.boardId })
      .getOne();

    if (!like || typeof like === 'undefined') {
      await this.boardRepo
        .createQueryBuilder()
        .update()
        .set({ watchCount: () => 'likeCount+1' })
        .where('boardId = :boardId', { boardId: board.boardId })
        .execute();
      await this.likeRepo.save({ user, board });
      this.logger.log(`${user.email} 가 ${board.boardId} 좋아요 누름`);
      return { message: `${user.email}가 [${board.title}] 글에 좋아요 누름` };
    } else {
      await this.boardRepo
        .createQueryBuilder()
        .update()
        .set({ watchCount: () => 'likeCount-1' })
        .where('boardId = :boardId', { boardId: board.boardId })
        .execute();
      await this.likeRepo.remove(like);
      this.logger.log(`${user.email} 가 ${board.boardId} 좋아요 삭제`);
      return { message: `${user.email}가 [${board.title}] 글에 좋아요 삭제` };
    }
  }

  async foundEmail(email: string) {
    const user = await this.userRepo
      .findOne({
        where: { email: email },
      })
      .catch((err) => {
        this.logger.error(err);
        throw new NotFoundException('사용자가 없습니다.');
      });
    if (!user || typeof user === 'undefined') {
      this.logger.error(`사용자(${email})가 없습니다.`);
      throw new NotFoundException(`사용자(${email})가 없습니다.`);
    } else {
      return user;
    }
  }

  async foundBoard(id: number) {
    const board = await this.boardRepo
      .findOne({ where: { boardId: id } })
      .catch((err) => {
        this.logger.error(err);
        throw new NotFoundException('게시글이 없습니다.');
      });
    if (!board || typeof board === 'undefined') {
      this.logger.error(`게시글(no.${id})이 없습니다.`);
      throw new NotFoundException(`게시글(no.${id})이 없습니다.`);
    } else {
      return board;
    }
  }
}
