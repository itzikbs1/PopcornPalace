import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from "uuid";

// import { ShowTimeService } from '../showtime/showtime.service';
// import { UserService } from '../users/user.service';
import { Booking, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookingDto } from './create-booking';

@Injectable()
export class BookingService {

    // constructor(private readonly showtimeService: ShowTimeService, private readonly userService: UserService) {}
    constructor(private readonly dbService: DatabaseService) {}


    async createBooking(data: CreateBookingDto): Promise<{ bookingId: string }> {
        const { userId, showtimeId, seatNumber } = data;
    
        // Validate Showtime exists
        const showtimeExists = await this.dbService.showtime.findUnique({
          where: { id: showtimeId },
        });
        if (!showtimeExists) {
          throw new NotFoundException(`Showtime with id ${showtimeId} not found`);
        }
    
        // Validate User exists
        const userExists = await this.dbService.user.findUnique({ where: { id: userId } });
        if (!userExists) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
    
        // Validate seat is not already booked
        const existingBooking = await this.dbService.booking.findFirst({
          where: {
            showtimeId: showtimeId,
            seatNumber: seatNumber,
          },
        });
    
        if (existingBooking) {
          throw new BadRequestException(`Seat ${seatNumber} is already booked`);
        }
    
        // Create Booking
        const booking = await this.dbService.booking.create({
          data: {
            user: { connect: { id: userId } },
            showtime: { connect: { id: showtimeId } },
            seatNumber: seatNumber,
            status: 'CONFIRMED',
          },
        });

        return { "bookingId": booking.bookingId};
      }

    // cancelBooking(bookingId: string): { message: string } {
    //     const booking = this.bookings.find((b) => b.bookingId === bookingId);
        
    //     if (!booking) {
    //         throw new NotFoundException('Booking not found');
    //     }
      
    //     if (booking.status === 'CANCELED') {
    //         throw new BadRequestException('Booking is already canceled');
    //     }
    //     booking.status = 'CANCELED';
        
    //     return { message: 'Booking canceled successfuly' };
    // }

    
    // findBookingById(bookingId: string): Booking {
    //     const booking = this.bookings.find((b) => b.bookingId === bookingId);
    //     if (!booking) {
    //     throw new NotFoundException('Booking not found');
    //     }
    //     return booking;
    // }
}