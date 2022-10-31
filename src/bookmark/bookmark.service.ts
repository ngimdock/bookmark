import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const bookmarks = await this.prismaService.bookmark.findMany();

    return bookmarks;
  }
}
