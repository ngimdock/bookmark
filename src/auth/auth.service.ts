import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(authDto: AuthDto) {
    try {
      const hash = await argon2.hash(authDto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });

      const accessToken = await this.generateToken(user.id, user.email);

      return accessToken;
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
      const user = await this.prismaService.user.findUnique({
        where: {
          email: authDto.email,
        },
      });

      if (!user)
        throw new ForbiddenException(
          'The user with the provided email does not exist',
        );

      const isPasswordMatched = await argon2.verify(
        user.hash,
        authDto.password,
      );

      if (!isPasswordMatched)
        throw new ForbiddenException('The given password is not correspond');

      const accessToken = await this.generateToken(user.id, user.email);

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  private async generateToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '30m',
    });

    return { access_token: token };
  }
}
