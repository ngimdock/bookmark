import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { UpdateUserDto } from '../src/user/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from 'src/bookmark/dto';

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
          .expectStatus(HttpStatus.CREATED)
          .stores('userAt', 'access_token');
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
    describe('Get me', () => {
      it('sould get the current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('update user', () => {
      const dto: UpdateUserDto = {
        firstname: 'danilix',
        lastname: 'dan',
      };

      it('sould update the current user', () => {
        return pactum
          .spec()
          .patch('/users/update')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.firstname)
          .expectBodyContains(dto.lastname);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('Sould get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK)
          .expectBody([]); //expect that the waiting result is and empty array
      });
    });

    describe('Create bookmark', () => {
      it('sould create a bookmark ', () => {
        const dto: CreateBookmarkDto = {
          title: 'dragon ball Z',
          description: 'one of the good anime',
          link: 'https://dragon-ballz.com',
        };

        return pactum
          .spec()
          .post('/bookmarks/create')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkId', 'id');
      });
    });

    describe('sould get all bookmarks', () => {
      it('Sould get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('sould get bookmark by id', () => {
      it('Sould get bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
          .inspect();
      });
    });

    describe('sould update bookmark by id', () => {
      const dto: UpdateBookmarkDto = {
        link: 'updated link',
        description: 'updated description',
      };
      it('Sould update bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.description);
      });
    });

    describe('sould delete bookmark by id', () => {
      it('Sould delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.NO_CONTENT);
      });

      it('Sould get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0);
      });
    });
  });
});
