import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { ShowTimeService } from '../showtime/showtime.service';

describe('BookingController', () => {
    let controller: BookingController;
    let service: BookingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingController],
            providers: [
                {
                    provide: BookingService,
                    useValue: {
                        createBooking: jest.fn(),
                        getBookingById: jest.fn(),
                    },
                },
                {
                    provide: ShowTimeService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<BookingController>(BookingController);
        service = module.get<BookingService>(BookingService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // POST /bookings (Success)
    it('should create a booking successfully', async () => {
        const bookingData = {
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 1,
            seatNumber: 15,
            status: BookingStatus.CONFIRMED,
        };

        const createdBooking = {
            bookingId: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
        };

        jest.spyOn(service, 'createBooking').mockResolvedValue(createdBooking);

        const result = await controller.createBooking(bookingData);
        expect(result).toEqual(createdBooking);
    });

    // POST /bookings (Missing Fields)
    it('should throw BadRequestException if required fields are missing', async () => {
        jest.spyOn(service, 'createBooking').mockImplementation(() => {
            throw new BadRequestException('Missing required fields');
        });

        await expect(controller.createBooking({} as any)).rejects.toThrow(BadRequestException);
    });

    // POST /bookings (Showtime Not Found → BadRequestException)
    it('should throw BadRequestException if showtime does not exist', async () => {
        jest.spyOn(service, 'createBooking').mockImplementation(() => {
            throw new BadRequestException('Showtime not found');
        });

        await expect(controller.createBooking({
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 99,
            seatNumber: 15,
        })).rejects.toThrow(BadRequestException);
    });

    // POST /bookings (Seat Already Taken → ConflictException)
    it('should throw ConflictException if seat is already booked', async () => {
        jest.spyOn(service, 'createBooking').mockImplementation(() => {
            throw new ConflictException('Seat already booked');
        });

        await expect(controller.createBooking({
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 1,
            seatNumber: 15,
        })).rejects.toThrow(ConflictException);
    });

    // GET /bookings/:id (Success)
    it('should return a booking by string ID', async () => {
        const bookingId = 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae';
        const mockBooking = {
            bookingId,
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 1,
            seatNumber: 15,
            status: BookingStatus.CONFIRMED,
            createdAt: new Date(),
        };

        jest.spyOn(service, 'getBookingById').mockResolvedValue(mockBooking);

        const result = await controller.getBooking(bookingId);
        expect(result).toEqual(mockBooking);
    });

    // GET /bookings/:id (Not Found → BadRequestException)
    // async jest.spyOn(service, 'getBookingById').mockImplementation((bookingId: string) => {
    //     throw new BadRequestException(`Booking with ID ${bookingId} not found`); // ✅ Match the actual service error message
    // });

    // await expect(controller.getBooking('non-existent-id')).rejects.toThrow(
    //     new BadRequestException(`Booking with ID non-existent-id not found`) // ✅ Match exact error message
    // );
});
