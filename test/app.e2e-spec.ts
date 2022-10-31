import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto';

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
    await app.listen(3333);

    prismaService = app.get(PrismaService);

    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'danilix@gmail.com',
      password: '0000089',
    };

    describe('Register', () => {
      const ROUTE_REGISTER = '/auth/register';

      it('sould throw error if no dto is provided', () => {
        return pactum
          .spec()
          .post(ROUTE_REGISTER)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould throw error if email is empty', () => {
        return pactum
          .spec()
          .post(ROUTE_REGISTER)
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould throw error is password is empty', () => {
        return pactum
          .spec()
          .post(ROUTE_REGISTER)
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould throw error if email is not and email', () => {
        return pactum
          .spec()
          .post(ROUTE_REGISTER)
          .withBody({ ...dto, email: 'ngimdock' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould register a new user', () => {
        return pactum
          .spec()
          .post(ROUTE_REGISTER)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Login', () => {
      const ROUTE_LOGIN = '/auth/login';
      it('sould throw error if no dto is provided', () => {
        return pactum
          .spec()
          .post(ROUTE_LOGIN)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould throw error if email is empty', () => {
        return pactum
          .spec()
          .post(ROUTE_LOGIN)
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould throw error is password is empty', () => {
        return pactum
          .spec()
          .post(ROUTE_LOGIN)
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould throw error if email is not and email', () => {
        return pactum
          .spec()
          .post(ROUTE_LOGIN)
          .withBody({ ...dto, email: 'ngimdock' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('sould login a user', () => {
        return pactum
          .spec()
          .post(ROUTE_LOGIN)
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    const ROUTE_USER = '/users/me';
    describe('Get me', () => {
      it('sould get the current user', () => {
        return pactum
          .spec()
          .get(ROUTE_USER)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK)
          .inspect();
      });
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

    describe('Get bookmark by id', () => {
      //
    });

    describe('Update bookmark by id', () => {
      //
    });

    describe('Delete bookmark by id', () => {
      //
    });
  });
});
