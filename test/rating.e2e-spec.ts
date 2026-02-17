import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RatingModule } from '../src/features/rate/rating.module';

describe('RateController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RatingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ rates (POST)', () => {
    return request(app.getHttpServer())
      .post('/rates')
      .expect(200)
      .expect('Hello World!');
  });
});
