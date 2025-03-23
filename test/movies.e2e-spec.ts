import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from 'src/database/database.service';
describe('Movies API (e2e)', () => {
  let app: INestApplication;

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

    await request(app.getHttpServer()).post('/movies').send({
      title: 'Inception',
      genre: 'Sci-fi',
      duration: 148,
      rating: 8.8,
      releaseYear: 2010
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/movies/all (GET) - should return all movies', async () => {
    const response = await request(app.getHttpServer()).get('/movies/all');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/movies (POST) - should create a movie', async () => {
    const newMovie = { title: 'Avatar', genre: 'Sci-fi', duration: 162, rating: 8.0, releaseYear: 2009 };
    const response = await request(app.getHttpServer()).post('/movies').send(newMovie);
    expect(response.status).toBe(200);
    // console.log('Response Body:', response.body);
    // expect(response.body, newMovie);
    // expect(response.body).toHaveProperty('message');
    // expect(response.body.message).toContain('Error creating movie');
    // expect(response.body).toHaveProperty('statusCode', 400);
  });

  it('/movies/:title (GET) - should get a movie by title', async () => {
    const response = await request(app.getHttpServer()).get('/movies/Inception');
    expect(response.status).toBe(200);
  });

  it('/movies/update/:title (POST) - should update a movie', async () => {
    const updatedMovie = { title: 'Inception', genre: 'Sci-fi Thriller', duration: 148, rating: 9.0, releaseYear: 2010 };
    const response = await request(app.getHttpServer()).post('/movies/update/Inception').send(updatedMovie);
    expect(response.status).toBe(200);
  });

  it('/movies/:title (DELETE) - should delete a movie', async () => {
    const response = await request(app.getHttpServer()).delete('/movies/Inception');
    expect(response.status).toBe(200);
  });
});
