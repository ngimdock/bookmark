import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async updateUser(userId: number, dto: UpdateUserDto) {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: { ...dto },
    });

    delete updatedUser.hash;

    return updatedUser;
  }
}
