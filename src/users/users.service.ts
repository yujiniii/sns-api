import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, nickname, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.findOne({ where: { email } }).then((user) => {
      if (user) {
        this.logger.error(
          `UNIQUE ERROR | DB에 ${email} 을 가진 다른 사용자가 존재합니다.`,
        );
        throw new BadRequestException('다른 이메일을 사용하세요');
      }
    });
    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
    });
    await this.userRepo.save(user).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        this.logger.error(
          `UNIQUE ERROR | DB에 ${nickname} 을 가진 다른 사용자가 존재합니다. `,
        );
        throw new BadRequestException(
          '같은 닉네임을 가진 사용자가 존재합니다.',
        );
      } else {
        this.logger.error('DB 등록 에러');
        throw new Error(err);
      }
    });
    this.logger.log(`${email}의 회원가입이 정상적으로 처리되었습니다.`);
    return user;
  }

  async signIn(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      this.logger.error(`이메일 오류로 ${email}의 로그인에 실패하였습니다.`);
      throw new BadRequestException('이메일 혹은 비밀번호를 확인하여 주세요');
    }
    const check = await bcrypt.compare(password, user.password);
    if (check) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.log(`${email}의 로그인이 정상적으로 처리되었습니다.`);
      return {
        message: `Hello ${user.nickname}!`,
        token: accessToken,
      };
    } else {
      this.logger.error(`비밀번호 오류로 ${email}의 로그인에 실패하였습니다.`);
      throw new BadRequestException('이메일 혹은 비밀번호를 확인하여 주세요');
    }
  }
}
