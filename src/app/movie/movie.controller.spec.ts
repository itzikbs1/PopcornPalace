import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MovieController', () => {
    let controller: MovieController;
    let movieService: MovieService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MovieController],
            providers: [
                {
                    provide: MovieService,
                    useValue: {
                        getAllMovies: jest.fn(),
                        addMovie: jest.fn(),
                        updateMovie: jest.fn(),
                        deleteMovie: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<MovieController>(MovieController);
        movieService = module.get<MovieService>(MovieService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // Get All Movies
    it('should return an empty array when no movies are found', async () => {
        jest.spyOn(movieService, 'getAllMovies').mockResolvedValue([]);
        const result = await controller.getAllMovies();
        expect(result).toEqual([]);
    });

    // Add Movie (Success)
    it('should create a movie successfully', async () => {
        const movieData = {
            title: 'Inception',
            genre: 'Sci-Fi',
            duration: 148,
            rating: 9,
            releaseYear: 2010,
        };

        jest.spyOn(movieService, 'addMovie').mockResolvedValue({ id: 1, ...movieData });

        const result = await controller.createMovie(movieData);
        expect(result).toHaveProperty('id', 1);
        expect(result.title).toBe('Inception');
    });

    // Add Movie (Validation Error)
    it('should throw an error if required fields are missing', async () => {
        jest.spyOn(movieService, 'addMovie').mockRejectedValue(() => {
            throw new BadRequestException('Validation error');
        });

        await expect(controller.createMovie({ title: 'Incomplete Movie' } as any)).rejects.toThrow(BadRequestException);
    });

    // Update Movie by Title (Success)
    it('should update a movie successfully', async () => {
        const updatedMovie = {
            id: 1,
            title: 'Inception',
            genre: 'Sci-Fi',
            duration: 148,
            rating: 9.5,
            releaseYear: 2010,
        };
        jest.spyOn(movieService, 'updateMovie').mockResolvedValue(updatedMovie);

        const result = await controller.update('Inception', { rating: 9.5 });
        expect(result.rating).toBe(9.5);
    });

    // Update Movie (Not Found)
    it('should throw an error if movie is not found during update', async () => {
        jest.spyOn(movieService, 'updateMovie').mockImplementation(() => {
            throw new NotFoundException('Movie not found');
        });

        await expect(controller.update('Nonexistent', { rating: 9.5 })).rejects.toThrow(NotFoundException);
    });

    // Delete Movie by Title (Success)
    it('should delete a movie successfully', async () => {
        const deletedMovie = {
            id: 1,
            title: 'Inception',
            genre: 'Sci-Fi',
            duration: 148,
            rating: 9,
            releaseYear: 2010,
        };
        jest.spyOn(movieService, 'deleteMovie').mockResolvedValue(deletedMovie);

        const result = await controller.deleteMovie('Inception');
        expect(result.title).toBe('Inception');
    });

    // Delete Movie (Not Found)
    it('should throw an error if movie is not found during deletion', async () => {
        jest.spyOn(movieService, 'deleteMovie').mockImplementation(() => {
            throw new NotFoundException('Movie not found');
        });

        await expect(controller.deleteMovie('Nonexistent')).rejects.toThrow(NotFoundException);
    });
});
