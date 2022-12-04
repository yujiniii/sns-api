import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  // ----- User : Like = 1 : N -----
  @ManyToOne(() => User, (user) => user.userId)
  user: User;

  // ----- Board : Like = 1 : N -----
  @ManyToOne(() => Board, (board) => board.boardId)
  board: Board;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
