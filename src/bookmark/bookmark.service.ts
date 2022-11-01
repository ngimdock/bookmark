import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBookmarks(userId: number) {
    try {
      const bookmarks = await this.prismaService.bookmark.findMany({
        where: {
          userId,
        },
      });

      return bookmarks;
    } catch (err) {
      throw err;
    }
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException();

    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    try {
      const createdBookmark = await this.prismaService.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });

      return createdBookmark;
    } catch (err) {
      throw err;
    }
  }

  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {
    //
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    //
  }
}
