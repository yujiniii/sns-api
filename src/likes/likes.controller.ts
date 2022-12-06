import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';
import { GetUser } from '../users/user.decorator';

@UseGuards(AuthGuard())
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/:id')
  click(@Param('id') id: string, @GetUser() getUser: string) {
    const result = this.likesService.click(+id, getUser);
    return Object.assign(result);
  }
}
