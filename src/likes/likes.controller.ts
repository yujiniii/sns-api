import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';

@UseGuards(AuthGuard())
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/:id')
  click(@Param() id: string) {
    return this.likesService.click(+id);
  }
}
