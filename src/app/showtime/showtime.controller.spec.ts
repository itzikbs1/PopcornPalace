import { Test, TestingModule } from '@nestjs/testing';
import { ShowTimeController } from './showtime.controller';
import { ShowTimeService } from './showtime.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('ShowTimeController', () => {
    let controller: ShowTimeController;
    let service: ShowTimeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShowTimeController],
            providers: [
                {
                    provide: ShowTimeService,
                    useValue: {
                        getShowTimeById: jest.fn(),
                        addShowTime: jest.fn(),
                        updateShowTime: jest.fn(),
                        deleteShowTime: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ShowTimeController>(ShowTimeController);
        service = module.get<ShowTimeService>(ShowTimeService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // GET /showtimes/:id (Success)
    it('should return a showtime by ID', async () => {
        const mockShowtime = { id: 1, movieId: 1, theater: 'Cinema City', startTime: new Date(), endTime: new Date(), price: 50 };

        jest.spyOn(service, 'getShowTimeById').mockResolvedValue(mockShowtime);

        const result = await controller.getShowTimeById(1);
        expect(result).toEqual(mockShowtime);
    });

    // GET /showtimes/:id (Not Found → BadRequest)
    it('should throw BadRequestException if showtime is not found', async () => {
        jest.spyOn(service, 'getShowTimeById').mockImplementation(() => {
            throw new BadRequestException('Showtime not found');
        });

        await expect(controller.getShowTimeById(99)).rejects.toThrow(BadRequestException);
    });

    // POST /showtimes (Success)
    it('should create a showtime successfully', async () => {
        const newShowtime = { movieId: 1, theater: 'IMAX', startTime: new Date(), endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), price: 60 };
        const createdShowtime = { id: 1, ...newShowtime };

        jest.spyOn(service, 'addShowTime').mockResolvedValue(createdShowtime);

        const result = await controller.create(newShowtime);
        expect(result).toEqual(createdShowtime);
    });

    // POST /showtimes (Bad Request: Missing Fields)
    it('should throw BadRequestException if required fields are missing', async () => {
        const incompleteShowtime = { movieId: 1, theater: 'IMAX' };

        jest.spyOn(service, 'addShowTime').mockImplementation(() => {
            throw new BadRequestException('Required fields are missing');
        });

        await expect(controller.create(incompleteShowtime as any)).rejects.toThrow(BadRequestException);
    });

    // POST /showtimes (Overlapping Showtime → ConflictException)
    it('should throw ConflictException if showtime overlaps with another', async () => {
        const newShowtime = { movieId: 1, theater: 'IMAX', startTime: new Date(), endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), price: 60 };

        jest.spyOn(service, 'addShowTime').mockImplementation(() => {
            throw new ConflictException('Overlapping showtime');
        });

        await expect(controller.create(newShowtime)).rejects.toThrow(ConflictException);
    });

    // POST /showtimes/update/:id (Success)
    it('should update a showtime successfully', async () => {
        const updatedShowtime = { id: 1, movieId: 1, theater: 'Cinema City', startTime: new Date(), endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), price: 70 };

        jest.spyOn(service, 'updateShowTime').mockResolvedValue(updatedShowtime);

        const result = await controller.update(1, { price: 70 });
        expect(result.price).toBe(70);
    });

    // POST /showtimes/update/:id (Not Found → BadRequest)
    it('should throw BadRequestException if showtime to update is not found', async () => {
        jest.spyOn(service, 'updateShowTime').mockImplementation(() => {
            throw new BadRequestException('Showtime not found');
        });

        await expect(controller.update(99, { price: 70 })).rejects.toThrow(BadRequestException);
    });

    // POST /showtimes/update/:id (Start Time After End Time)
    it('should throw BadRequestException if start time is after or equal to end time', async () => {
        const invalidUpdate = { startTime: new Date(), endTime: new Date() };

        jest.spyOn(service, 'updateShowTime').mockImplementation(() => {
            throw new BadRequestException('Start time must be before end time');
        });

        await expect(controller.update(1, invalidUpdate)).rejects.toThrow(BadRequestException);
    });

    // DELETE /showtimes/:id (Success)
    it('should delete a showtime successfully', async () => {
        const deletedShowtime = { id: 1, movieId: 1, theater: 'Cinema City', startTime: new Date(), endTime: new Date(), price: 50 };

        jest.spyOn(service, 'deleteShowTime').mockResolvedValue(deletedShowtime);

        const result = await controller.delete(1);
        expect(result).toEqual(deletedShowtime);
    });

    // DELETE /showtimes/:id (Not Found → BadRequest)
    it('should throw BadRequestException if showtime to delete is not found', async () => {
        jest.spyOn(service, 'deleteShowTime').mockImplementation(() => {
            throw new BadRequestException('Showtime not found');
        });

        await expect(controller.delete(99)).rejects.toThrow(BadRequestException);
    });
});
