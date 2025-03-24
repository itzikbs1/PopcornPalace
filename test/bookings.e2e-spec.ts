import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from 'src/database/database.service';

describe('Bookings API (e2e)', () => {
  let app: INestApplication;
  let createdShowtimeId: number;
  let createdMovieId: number;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  
    const prismaService = app.get(DatabaseService);
    await prismaService.booking.deleteMany();
    await prismaService.showtime.deleteMany();
    await prismaService.movie.deleteMany();
    await prismaService.user.deleteMany();

    const movie = await prismaService.movie.create({
      data: {
        title: 'Inception',
        genre: 'Sci-fi',
        duration: 148,
        rating: 8.8,
        releaseYear: 2010
      },
    });
    
  createdMovieId = movie.id;
  const showtime = await prismaService.showtime.create({
    data: {
        movieId: createdMovieId,
        theater: 'Sample theater',
        startTime: '2025-02-14T11:47:46.125405Z', 
        endTime: '2025-02-14T14:47:46.125405Z',
        price: 20.2
    }    
  });
  createdShowtimeId = showtime.id;

  const user = await prismaService.user.create({
    data: {
        name: 'Itzik',
        email: 'test@gmail.com',
        password: '123456',
        createdAt: new Date('2025-02-14T11:47:46.125Z'),
        updatedAt: new Date('2025-02-14T11:47:46.125Z')
    }
  });
  createdUserId = user.id;
});

  afterAll(async () => {
    await app.close();
  });

  it('/bookings (POST) - should create a booking', async () => {
    
    const newBooking = {
      showtimeId: createdShowtimeId, 
      seatNumber: 15,
      userId: createdUserId
    };
    const response = await request(app.getHttpServer()).post('/bookings').send(newBooking);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bookingId');
  });
});