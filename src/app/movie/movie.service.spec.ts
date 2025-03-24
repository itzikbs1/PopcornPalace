import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { DatabaseService } from '../../database/database.service';
import { BadRequestException } from '@nestjs/common';

describe('MovieService', () => {
    let service: MovieService;
    let database: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                {
                    provide: DatabaseService,
                    useValue: {
                        movie: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<MovieService>(MovieService);
        database = module.get<DatabaseService>(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Get all movies (empty case)
    it('should return an empty array when no movies are found', async () => {
        jest.spyOn(database.movie, 'findMany').mockResolvedValue([]);
        
        const result = await service.getAllMovies();
        expect(result).toEqual([]);
    });

    // Add a movie (Success)
    it('should create a movie successfully', async () => {
        const movieData = {
            title: 'Inception',
            genre: 'Sci-Fi',
            duration: 148,
            rating: 9,
            releaseYear: 2010,
        };

        jest.spyOn(database.movie, 'create').mockResolvedValue({
            id: 1,
            ...movieData,
        });

        const result = await service.addMovie(movieData);
        expect(result).toHaveProperty('id', 1);
        expect(result.title).toBe('Inception');
    });

    // Add a movie (Missing required fields)
    it('should throw an error when required fields are missing', async () => {
        const incompleteMovieData = {
            title: 'Inception',
        };

        await expect(service.addMovie(incompleteMovieData as any)).rejects.toThrow(BadRequestException);
    });

    // Update a movie by `movieTitle` (Success)
    it('should update a movie successfully if it exists', async () => {
        const existingMovie = {id: 1, title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 9, releaseYear: 2010 };
        const updatedMovie = { ...existingMovie, rating: 9.5 };

        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(existingMovie);
        jest.spyOn(database.movie, 'update').mockResolvedValue(updatedMovie);

        const result = await service.updateMovie('Inception', { rating: 9.5 });
        expect(result.rating).toBe(9.5);
    });

    // Update a movie (Movie does not exist)
    it('should throw 400 error if movie does not exist when updating', async () => {
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(null);

        await expect(service.updateMovie('Nonexistent Movie', { rating: 9.5 })).rejects.toThrow(BadRequestException);
    });

    // Delete a movie by `movieTitle` (Success)
    it('should delete a movie successfully if it exists', async () => {
        const existingMovie = {
            id: 1,
            title: 'Inception',
            genre: 'Sci-Fi',
            duration: 148,
            rating: 9,
            releaseYear: 2010,
        };
        
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(existingMovie);
        jest.spyOn(database.movie, 'delete').mockResolvedValue(existingMovie);

        const result = await service.deleteMovie('Inception');
        expect(result).toEqual(existingMovie);
    });

    // Delete a movie (Movie does not exist)
    it('should throw 400 error if movie does not exist when deleting', async () => {
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(null);

        await expect(service.deleteMovie('Nonexistent Movie')).rejects.toThrow(BadRequestException);
    });
});