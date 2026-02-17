import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RatingModule } from '../src/features/rating/rating.module';

describe('RatingController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RatingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /rating returns 404 for unsupported carrier', () => {
    return request(app.getHttpServer())
      .post('/rating')
      .send({
        carrier: 'fedex',
        origin: {
          street1: '1 Main St',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          countryCode: 'US',
        },
        destination: {
          street1: '2 Market St',
          city: 'Dallas',
          state: 'TX',
          postalCode: '75201',
          countryCode: 'US',
        },
        packages: [{ weight: { value: 1, unit: 'lb' } }],
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe('No rating strategy found for "fedex"');
      });
  });
});
