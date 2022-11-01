import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBookmarks() {
    try {
      const bookmarks = await this.prismaService.bookmark.findMany();

      return bookmarks;
    } catch (err) {
      throw err;
    }
  }

  async getBookmarkById(bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException();

    return bookmark;
  }

  async createBookmark(dto: CreateBookmarkDto) {
    try {
      // const createdBookmark = await this.prismaService.bookmark.createMany({
      //   data: dto,
      // });

      return dto;
    } catch (err) {
      throw err;
    }
  }

  async updateBookmarkById(bookmarkId: number, dto: CreateBookmarkDto) {
    //
  }

  async deleteBookmarkById(bookmarkId: string) {
    //
  }
}
