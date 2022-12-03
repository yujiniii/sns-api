import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;

  // ----- User : Board = 1:N ----
  @ManyToOne(() => User, (user) => user.userId, { eager: true })
  @JoinColumn({ name: 'userId' }) //생략가능
  user: User;
}
