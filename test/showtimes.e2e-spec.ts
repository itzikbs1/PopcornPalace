import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from 'src/database/database.service';

describe('Showtimes API (e2e)', () => {
  let app: INestApplication;
  let createdShowtimeId: number;
  let createdMovieId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  
    const prismaService = app.get(DatabaseService);
    // await prismaService.booking.deleteMany();
    // await prismaService.showtime.deleteMany();
    // await prismaService.movie.deleteMany();

    await prismaService.$transaction([
      prismaService.booking.deleteMany(),
      prismaService.showtime.deleteMany(),
      prismaService.movie.deleteMany(),
  ]);
  
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
  // console.log('Created movie with ID:', createdMovieId, 'Type:', typeof createdMovieId);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/showtimes (POST) - should create a showtime', async () => {
    const newShowtime = {
      movieId: createdMovieId, 
      theater: 'Sample Theater', 
      startTime: '2025-02-14T11:47:46.125405Z', 
      endTime: '2025-02-14T14:47:46.125405Z',
      price: 20.2
    };
    const response = await request(app.getHttpServer()).post('/showtimes').send(newShowtime);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    createdShowtimeId = await response.body.id;
  });

  it('/showtimes/:id (GET) - should get a showtime by ID', async () => {
    const response = await request(app.getHttpServer()).get(`/showtimes/${createdShowtimeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdShowtimeId);
  });

  it('/showtimes/update/:id (POST) - should update a showtime', async () => {
    const updatedShowtime = {
      movieId: createdMovieId, 
      price: 50.2, 
      theater: 'Updated Theater', 
      startTime: '2025-02-14T11:47:46.125405Z', 
      endTime: '2025-02-14T14:47:46.125405Z'
    };
    const response = await request(app.getHttpServer()).post(`/showtimes/update/${createdShowtimeId}`).send(updatedShowtime);
    expect(response.status).toBe(200);
  });

  it('/showtimes/:id (DELETE) - should delete a showtime', async () => {
    const response = await request(app.getHttpServer()).delete(`/showtimes/${createdShowtimeId}`);
    // console.log('response ', response.body);
    
    expect(response.status).toBe(200);
  });
});
