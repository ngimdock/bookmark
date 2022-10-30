import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    prismaService = app.get(PrismaService);

    await prismaService.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  it.todo('hello');

  describe('Auth', () => {
    describe('Register', () => {
      it.todo('sould register a new user');
    });

    describe('Login', () => {
      it.todo('should login a user');
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      //
    });

    describe('update user', () => {
      //
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      //
    });

    describe('Get bookmarks', () => {
      //
    });

    describe('Get bookmark bu id', () => {
      //
    });

    describe('Upfate bookmark', () => {
      //
    });

    describe('Delete bookmark', () => {
      //
    });
  });
});
