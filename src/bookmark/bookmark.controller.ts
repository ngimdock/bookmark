import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks();
  }

  @Get(':id')
  getBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('id') userId: number,
  ) {
    //
  }

  @Post('create')
  createBookmark(
    @Body() dto: CreateBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    console.log({ dto });

    return this.bookmarkService.createBookmark(dto);
  }

  @Patch(':id')
  updateBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    //
  }

  @Delete(':id')
  deleteBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('id') userId: number,
  ) {
    //
  }
}
