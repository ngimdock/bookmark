import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }

  @Post('create')
  createBookmark(
    @Body() dto: CreateBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.createBookmark(userId, { ...dto });
  }

  @Patch(':id')
  updateBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.updateBookmarkById(userId, bookmarkId, dto);
  }

  @Delete(':id')
  deleteBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('id') userId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
