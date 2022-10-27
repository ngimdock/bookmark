import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(authDto: AuthDto) {
    try {
      const hash = await argon2.hash(authDto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(
          'The provided credential is already taken',
        );
      }

      throw error;
    }
  }

  async login(authDto: AuthDto) {
    try {
      // find user by email
      const user = await this.prismaService.user.findUnique({
        where: {
          email: authDto.email,
        },
      });

      //if not exist throw and error
      if (!user)
        throw new ForbiddenException(
          'The user with the provided email does not exist',
        );

      //compare password
      const isPasswordMatched = await argon2.verify(
        user.hash,
        authDto.password,
      );

      if (!isPasswordMatched)
        throw new ForbiddenException('The given password is not correspond');

      delete user.hash;

      return user;
    } catch (error) {
      throw error;
    }
  }
}
