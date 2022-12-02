import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MySQLDataSource } from 'src/config/typeorm.config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

const connection = MySQLDataSource2.initialize();

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
    let hashtags_db = this.findRealTag(hashtags);
    const user = await this.userRepo.findOne({
      where: { email: getUser.email },
    });

    const newBoard = await this.boardRepo.create({
      title,
      content,
      hashtags: hashtags_db.join(' '),
      user,
    });
    await this.boardRepo.save(newBoard);
    return newBoard;
  }

  findAll() {
    return `This action returns all boards`;
  }

  async findOne(id: number) {
    // ----------- 조회수 +1 트랜잭션 -------------
    const qRunner = await MySQLDataSource.createQueryRunner();
    await qRunner.connect();
    await qRunner.startTransaction();
    try {
      console.log('startTransaction');
      await qRunner.manager
        .createQueryBuilder()
        .update()
        .where('boardId = :id', { id: id })
        .set({ watchCount: () => 'watchCount+1' })
        .execute();
      await qRunner.commitTransaction();
      console.log('commitTransaction');
    } catch (err) {
      console.log('rollbackTransaction');
      console.log(err);
      await qRunner.rollbackTransaction();
    } finally {
      console.log('release');
      await qRunner.release();
    }
    // -----------------------------------------
    const theBoard = await this.boardRepo.findBy({ boardId: id }); // 조회수 변경 이후  조회
    return theBoard;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
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
}
