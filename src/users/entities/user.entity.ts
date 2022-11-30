import {
  BaseEntity,
  Column,
  Entity,
  //   JoinColumn,
  //   OneToMany,
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

  //   @OneToMany(() => Board, (board) => board.userId)
  //   @JoinColumn()
  //   board: Board[];
}
