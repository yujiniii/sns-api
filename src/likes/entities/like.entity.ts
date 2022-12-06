import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  // ----- User : Like = 1 : N -----
  @ManyToOne(() => User, (user) => user.like, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  // ----- Board : Like = 1 : N -----
  @ManyToOne(() => Board, (board) => board.like, { eager: true })
  @JoinColumn({ name: 'boardId' })
  board: Board;
}
