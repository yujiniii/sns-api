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

  // ----- 둘중 뭐 쓸지 좀 더 고민해보기 ----
  @DeleteDateColumn()
  deletedAt!: Date | null;

  @Column({ default: false })
  isDeleted: boolean;

  // ----- User : Board = 1:N ----
  @ManyToOne(() => User, (user) => user.userId)
  // @JoinColumn() 생략가능
  user: User;
}
