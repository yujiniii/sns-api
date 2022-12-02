import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  createUser(@Body() createUserDto: CreateUserDto) {
    const result = this.usersService.createUser(createUserDto);
    return Object.assign(result);
  }

  @Get('session')
  signIn(@Body() signinUserDto: SigninUserDto) {
    const result = this.usersService.signIn(signinUserDto);
    return Object.assign(result);
  }

  @Get()
  @UseGuards(AuthGuard())
  tokenTest(@GetUser() getUser) {
    console.log(typeof getUser.email);
    return Object.assign(getUser);
  }
}
