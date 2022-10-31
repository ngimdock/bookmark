import { Controller, Get } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly prismaService: BookmarkService) {}

  @Get()
  getAll() {
    return this.prismaService.getAll();
  }
}
