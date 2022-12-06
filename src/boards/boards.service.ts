/* eslint-disable prefer-const */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { MySQLDataSource } from 'src/config/typeorm.config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { SearchBoardDto } from './dto/search-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

// const connection = MySQLDataSource.initialize();

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepo: Repository<Board>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createBoardDto: CreateBoardDto, getUser) {
    const { title, content, hashtags } = createBoardDto;
    let hashtags_db: string[] = this.findRealTag(hashtags);
    const user = await this.foundEmail(getUser.email);
    const newBoard = await this.boardRepo.create({
      title,
      content,
      hashtags: hashtags_db.join(' '),
      user,
    });
    await this.boardRepo.save(newBoard);
    return newBoard;
  }

  async findAll(searchBoardDto: SearchBoardDto) {
    const {
      keyword = '',
      hastags = '',
      orderby = 'createdAt',
      isAsc = 'ASC',
      page = '10',
      pageno = '1',
    } = searchBoardDto;
    const offset = (Number(pageno) - 1) * Number(page);
    const boards = await this.boardRepo
      .createQueryBuilder()
      .where('title like  :key', { key: '%' + keyword + '%' })
      .orWhere('content like  :key', { key: '%' + keyword + '%' })
      .orWhere('hashtags like  :key', { key: '%' + hastags + '%' })
      .take(Number(page))
      .skip(offset)
      .orderBy(orderby, isAsc)
      .getMany();

    if (!boards || typeof boards === 'undefined') {
      throw new NotFoundException('조회 오류');
    }
    console.log(boards);
    return boards;
  }

  async findOne(id: number) {
    // 조회수 +1
    await this.boardRepo
      .createQueryBuilder()
      .update()
      .set({ watchCount: () => 'watchCount+1' })
      .where('boardId = :boardId', { boardId: id })
      .execute();

    const theBoard = await this.foundBoard(id); // 조회수 변경 이후  조회
    return theBoard;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, getUser) {
    const board = await this.foundBoard(id); // 수정 이후  조회
    const user = await this.foundEmail(getUser.email);
    if (user.userId === board.user.userId) {
      await this.boardRepo
        .createQueryBuilder()
        .update()
        .set({
          title: updateBoardDto.title,
          content: updateBoardDto.content,
        })
        .where('boardId = :boardId', { boardId: id })
        .execute();

      const theBoard = await this.foundBoard(id); // 수정 이후  조회
      return theBoard;
    } else {
      throw new ForbiddenException('본인의 게시글만 삭제가 가능합니다.');
    }
  }

  async remove(id: number, getUser) {
    const user = await this.foundEmail(getUser.email);
    const board = await this.foundBoard(id);
    console.log('user out fn : ', user);
    console.log('board out fn : ', board);
    console.log(user.userId, board.user.userId);
    if (user.userId === board.user.userId) {
      await this.boardRepo.softDelete(id).catch((err) => {
        console.log(err);
        throw new NotFoundException('삭제할 게시물이 존재하지 않습니다.');
      });
    } else {
      throw new ForbiddenException('본인의 게시글만 삭제가 가능합니다.');
    }
    return { message: '삭제 성공' };
  }

  async restore(id: number, getUser) {
    await this.boardRepo.restore(id);
    const user = await this.foundEmail(getUser.email);
    const board = await this.foundBoard(id);
    console.log(board);
    if (board.user.userId === user.userId) {
      return { message: '복원 성공' };
    } else {
      await this.boardRepo.softDelete(id);
      throw new ForbiddenException('작성자만 삭제가 가능합니다.');
    }
  }

  findRealTag(hashtags: string) {
    let hashtags_db: string[] = [];
    let temp: string[] = [];
    let a = 0;
    for (let i of hashtags + ',') {
      if (i === '#') {
        a = 1;
        continue;
      }
      if (i === ',') {
        hashtags_db.push(temp.join(''));
        temp = [];
        a = 0;
        continue;
      }
      if (i === ' ') {
        continue;
      }
      if (a === 1) {
        temp.push(i);
      }
    }
    return hashtags_db;
  }

  // async transaction(data: DataSource, boardId: number) {
  //   // ----------- 조회수 +1 트랜잭션 -------------(안됨 힝구리퐁퐁)
  //   const qRunner = await data.createQueryRunner();
  //   await qRunner.connect();
  //   await qRunner.startTransaction();
  //   try {
  //     console.log('startTransaction');
  //     await qRunner.manager
  //       .createQueryBuilder()
  //       .update()
  //       .set({ watchCount: 'watchCount+1' })
  //       .where('boardId = :boardId', { boardId: boardId })
  //       .execute();
  //     await qRunner.commitTransaction();
  //     console.log('commitTransaction');
  //   } catch (err) {
  //     console.log('rollbackTransaction');
  //     console.log(err);
  //     await qRunner.rollbackTransaction();
  //   } finally {
  //     console.log('release');
  //     await qRunner.release();
  //   }
  // }
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
