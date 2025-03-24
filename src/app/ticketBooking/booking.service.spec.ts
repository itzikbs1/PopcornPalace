import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { DatabaseService } from '../../database/database.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

describe('BookingService', () => {
    let service: BookingService;
    let database: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                {
                    provide: DatabaseService,
                    useValue: {
                        booking: {
                            findUnique: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            delete: jest.fn(),
                        },
                        showtime: {
                            findUnique: jest.fn(),
                        },
                        user: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<BookingService>(BookingService);
        database = module.get<DatabaseService>(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Create Booking (Success)
    it('should create a booking successfully', async () => {
        const newBooking = {
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 1,
            seatNumber: 15,
            status: BookingStatus.CONFIRMED,
        };
        const createdBooking = {
            bookingId: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
            ...newBooking,
            createdAt: new Date(),
        };
    
        jest.spyOn(database.user, 'findUnique').mockResolvedValue({
            id: newBooking.userId,
            name: 'John Doe', 
            email: 'john@example.com',
            password: 'hashedpassword123', 
            createdAt: new Date(), 
            updatedAt: new Date(), 
        });
    
        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue({
            id: 1,
            movieId: 5,
            theater: 'IMAX',
            startTime: new Date(),
            endTime: new Date(Date.now() + 7200000), 
            price: 50.0,
        });
    
        jest.spyOn(database.booking, 'findFirst').mockResolvedValue(null);
    
        jest.spyOn(database.booking, 'create').mockResolvedValue(createdBooking);
    
        const result = await service.createBooking(newBooking);
        expect(result).toEqual({
            bookingId: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae'
        });
    });

    // Create Booking (Missing Fields)
    it('should throw BadRequestException if required fields are missing', async () => {
        await expect(service.createBooking({} as any)).rejects.toThrow(BadRequestException);
    });

    // Create Booking (Showtime Not Found → BadRequestException)
    it('should throw BadRequestException if showtime does not exist', async () => {
        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue(null);

        await expect(service.createBooking({
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 99,
            seatNumber: 15,
        })).rejects.toThrow(BadRequestException);
    });

    // Create Booking (Seat Already Taken)
    it('should throw BadRequestException if seat is already booked', async () => {

        jest.spyOn(database.showtime, 'findUnique').mockResolvedValue({
            id: 1,
            movieId: 5,
            theater: 'IMAX',
            startTime: new Date(),
            endTime: new Date(Date.now() + 7200000), // 2 hours later
            price: 50.0,
        });

        jest.spyOn(database.booking, 'findFirst').mockResolvedValue({
            bookingId: 'existing-booking-id',
            showtimeId: 1,
            seatNumber: 15,
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            status: BookingStatus.CONFIRMED,
            createdAt: new Date(),
        });

        await expect(service.createBooking({
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 1,
            seatNumber: 15
        })).rejects.toThrow(BadRequestException);
    });

    // Get Booking by ID (Success)
    it('should return a booking by string ID', async () => {
        const bookingId = 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae';
        const mockBooking = {
            bookingId,
            userId: '84438967-f68f-4fa0-b620-0f08217e76af',
            showtimeId: 1,
            seatNumber: 15,
            status: BookingStatus.CONFIRMED,
            createdAt: new Date()
        };

        jest.spyOn(database.booking, 'findUnique').mockResolvedValue(mockBooking);

        const result = await service.getBookingById(bookingId);
        expect(result).toEqual(mockBooking);
    });

    // Get Booking by ID (Not Found → BadRequestException)
    it('should throw BadRequestException if booking is not found', async () => {
        jest.spyOn(database.booking, 'findUnique').mockResolvedValue(null);

        await expect(service.getBookingById('d1a6423b-4469-4b00-8c5f-e3cfc42eacae')).rejects.toThrow(BadRequestException);
    });

});