import { Like } from 'src/likes/entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  hashtags: string;

  @Column({ default: 0 })
  watchCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;

  // ----- User : Board = 1:N ----
  @ManyToOne(() => User, (user) => user.board, { eager: true })
  @JoinColumn({ name: 'userId' }) //생략가능
  user: User;

  // ----- Board : Like = 1 : N -----
  @OneToMany(() => Like, (like) => like.board)
  like: Like[];
}
