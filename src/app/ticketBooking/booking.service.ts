import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { Booking } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { CreateBookingDto } from './create-booking';

@Injectable()
export class BookingService {

    constructor(private readonly dbService: DatabaseService) {}


    async createBooking(bookingData: CreateBookingDto): Promise<{ bookingId: string }> {
        
        if (!bookingData.userId || !bookingData.showtimeId || !bookingData.seatNumber) {
          throw new BadRequestException('Missing required booking fields');
        }

        const { userId, showtimeId, seatNumber } = bookingData;

        if (seatNumber < 1) {
          throw new BadRequestException(`seatNumber must be greater from zero number`);
        }

        // Validate Showtime exists
        const showtimeExists = await this.dbService.showtime.findUnique({
          where: { id: showtimeId },
        });
        if (!showtimeExists) {
          throw new BadRequestException(`Showtime with id ${showtimeId} not found`);
        }
    
        // Validate User exists
        const userExists = await this.dbService.user.findUnique({ where: { id: userId } });
        if (!userExists) {
          throw new BadRequestException(`User with id ${userId} not found`);
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
    
    async getBookingById(bookingId: string): Promise<Booking> {
      
      if (!bookingId || typeof bookingId !== 'string') {
        throw new BadRequestException('Invalid booking ID');
      }

      const booking = await this.dbService.booking.findUnique({ where: { bookingId: bookingId } });

      if (!booking) {
          throw new BadRequestException(`Booking with ID ${bookingId} not found`);
      }

      return booking;
  }
}