import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/user.decorator';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { SearchBoardDto } from './dto/search-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@UseGuards(AuthGuard())
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @GetUser() getUser) {
    const result = this.boardsService.create(createBoardDto, getUser);
    return Object.assign(result);
  }

  @Get()
  findAll(@Query() searchBoardDto: SearchBoardDto) {
    const result = this.boardsService.findAll(searchBoardDto);
    return Object.assign(result);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @GetUser() getUser,
  ) {
    const result = this.boardsService.update(+id, updateBoardDto, getUser);
    return Object.assign(result);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() getUser: any) {
    return this.boardsService.remove(+id, getUser);
  }

  @Patch(':id/deleted')
  restore(@Param('id') id: string, @GetUser() getUser) {
    return this.boardsService.restore(+id, getUser);
  }
}
