import { Board } from 'src/boards/entities/board.entity';
import { Like } from 'src/likes/entities/like.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  password: string;

  // ----- User : Board = 1:N ----
  @OneToMany(() => Board, (board) => board.user)
  board: Board[];

  // ----- User : Like = 1 : N -----
  @OneToMany(() => Like, (like) => like.user)
  like: Like[];
}
