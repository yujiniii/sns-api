import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, nickname, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.findOne({ where: { email } }).then((user) => {
      if (user) {
        throw new BadRequestException('다른 이메일을 사용하세요');
      }
    });
    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
    });
    await this.userRepo.save(user);
    return user;
  }

  async signIn(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto;
    await this.userRepo.findOne({ where: { email } }).then(async (user) => {
      if (!user) {
        throw new BadRequestException('다른 이메일을 사용하세요');
      }
      if (await bcrypt.compare(user.password, password)) {
        return `Hello ${user.nickname}!`;
      }
    });
  }

  tokenTest() {
    return `This action returns a #er`;
  }
}
