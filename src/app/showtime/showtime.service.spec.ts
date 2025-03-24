import { Test, TestingModule } from '@nestjs/testing';
import { ShowTimeService } from './showtime.service';
import { DatabaseService } from '../../database/database.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('ShowTimeService', () => {
    let service: ShowTimeService;
    let database: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShowTimeService,
                {
                    provide: DatabaseService,
                    useValue: {
                        showtime: {
                            findUnique: jest.fn(),
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        movie: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ShowTimeService>(ShowTimeService);
        database = module.get<DatabaseService>(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // getShowTimeById (Success)
    it('should return a showtime by ID', async () => {
        const mockShowtime = { id: 1, movieId: 1, theater: 'Cinema City', startTime: new Date(), endTime: new Date(), price: 50 };

        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(mockShowtime);

        const result = await service.getShowTimeById(1);
        expect(result).toEqual(mockShowtime);
    });

    // getShowTimeById (Not Found → BadRequest)
    it('should throw BadRequestException if showtime is not found', async () => {
        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(null);

        await expect(service.getShowTimeById(99)).rejects.toThrow(BadRequestException);
    });

    // addShowTime (Success)
    it('should add a showtime successfully', async () => {
        const newShowtime = { movieId: 1, theater: 'IMAX', startTime: new Date(), endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), price: 60 };
        const createdShowtime = { id: 1, ...newShowtime };

        const mockMovie = { 
            id: 1, 
            title: 'Inception', 
            genre: 'Sci-Fi', 
            duration: 148, 
            rating: 9, 
            releaseYear: 2010 
        };
    
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(mockMovie);
        jest.spyOn(database.showtime, 'findFirst').mockResolvedValue(null); // No overlapping showtimes
        jest.spyOn(database.showtime, 'create').mockResolvedValue(createdShowtime);

        const result = await service.addShowTime(newShowtime);
        expect(result).toEqual(createdShowtime);
    });

    // addShowTime (Missing Fields)
    it('should throw BadRequestException if required fields are missing', async () => {
        const incompleteShowtime = { movieId: 1, theater: 'IMAX' };

        await expect(service.addShowTime(incompleteShowtime as any)).rejects.toThrow(BadRequestException);
    });

    // addShowTime (Movie Not Found → BadRequest)
    it('should throw BadRequestException if movie does not exist', async () => {
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(null);

        const newShowtime = { movieId: 99, theater: 'IMAX', startTime: new Date(), endTime: new Date(), price: 60 };

        await expect(service.addShowTime(newShowtime)).rejects.toThrow(BadRequestException);
    });

    // addShowTime (Overlapping Showtime → ConflictException)
    it('should throw ConflictException if showtime overlaps with another', async () => {
        const mockMovie = { 
            id: 1, 
            title: 'Inception', 
            genre: 'Sci-Fi', 
            duration: 148, 
            rating: 9, 
            releaseYear: 2010 
        };
    
        const overlappingShowtime = { 
            id: 2, 
            movieId: 1, 
            theater: 'IMAX', 
            startTime: new Date(), 
            endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), 
            price: 60 
        };
    
        const newShowtime = { 
            movieId: 1, 
            theater: 'IMAX', 
            startTime: new Date(), 
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            price: 60 
        };
    
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue(mockMovie);
    
        jest.spyOn(database.showtime, 'findFirst').mockResolvedValue(overlappingShowtime);

        await expect(service.addShowTime(newShowtime)).rejects.toThrow(ConflictException);
    });

    // updateShowTime (Success)
    it('should update a showtime successfully', async () => {
        const existingShowtime = { id: 1, movieId: 1, theater: 'Cinema City', startTime: new Date(), endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), price: 50 };
        const updatedData = { price: 70 };
        const updatedShowtime = { ...existingShowtime, ...updatedData };

        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(existingShowtime);
        jest.spyOn(database.showtime, 'update').mockResolvedValue(updatedShowtime);

        const result = await service.updateShowTime(1, updatedData);
        expect(result.price).toBe(70);
    });

    // updateShowTime (Not Found → BadRequest)
    it('should throw BadRequestException if showtime to update is not found', async () => {
        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(null);

        await expect(service.updateShowTime(99, { price: 70 })).rejects.toThrow(BadRequestException);
    });

    // deleteShowTime (Success)
    it('should delete a showtime successfully', async () => {
        const existingShowtime = { id: 1, movieId: 1, theater: 'Cinema City', startTime: new Date(), endTime: new Date(), price: 50 };

        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(existingShowtime);
        jest.spyOn(database.showtime, 'delete').mockResolvedValue(existingShowtime);

        const result = await service.deleteShowTime(1);
        expect(result).toEqual(existingShowtime);
    });

    // deleteShowTime (Not Found → BadRequest)
    it('should throw BadRequestException if showtime to delete is not found', async () => {
        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(null);

        await expect(service.deleteShowTime(99)).rejects.toThrow(BadRequestException);
    });

    //Try to add showtime with the same time for startTime and endTime -> BadRequestException
    it('should throw BadRequestException if start time is after or equal to end time', async () => {
        const invalidShowtime = { 
            movieId: 1, 
            theater: 'IMAX', 
            startTime: new Date(), 
            endTime: new Date(),
            price: 60 
        };
    
        jest.spyOn(database.movie, 'findUnique').mockResolvedValue({
            id: 1, title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 9, releaseYear: 2010
        });
    
        await expect(service.addShowTime(invalidShowtime)).rejects.toThrow(BadRequestException);
    });

    //Try to update showtime with the same time for startTime and endTime -> BadRequestException
    it('should throw BadRequestException if updated start time is after or equal to end time', async () => {
        const existingShowtime = { 
            id: 1, movieId: 1, theater: 'IMAX', startTime: new Date(), endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), price: 60 
        };
    
        const invalidUpdate = { 
            startTime: new Date(), 
            endTime: new Date()
        };
    
        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(existingShowtime);
    
        await expect(service.updateShowTime(1, invalidUpdate)).rejects.toThrow(BadRequestException);
    });
});
