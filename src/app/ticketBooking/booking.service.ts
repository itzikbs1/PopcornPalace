import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './create-booking';
import { Booking } from './booking';
import { ShowTimeService } from '../showtime/showtime.service';

@Injectable()
export class BookingService {
    private bookings: Booking[] = [];

    constructor(private readonly showtimeService: ShowTimeService) {}

    createBooking(dto: CreateBookingDto): String {
        const { showtimeId, seatNumber, userId } = dto;

        const showtime = this.showtimeService.getShowTimeById(showtimeId)
        
        if (!showtime) {
            throw new NotFoundException('Showtime not found.');
        }

        const exsitingBooking = this.bookings.find(
            (booking) => booking.showtimeId === showtimeId && booking.seatNumber === seatNumber
        );

        if (exsitingBooking) {
            throw new BadRequestException('Seat already booked');
        }

        const newBooking: Booking = {
            bookingId: Date.now().toString(),
            showtimeId,
            seatNumber,
            userId,
            status: 'CONFIRMED'
        }
        this.bookings.push(newBooking);

        showtime.bookings.push(newBooking.bookingId);
        
        return newBooking.bookingId;
    }

    cancelBooking(bookingId: string): { message: string } {
        const booking = this.bookings.find((b) => b.bookingId === bookingId);
        
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
      
        if (booking.status === 'CANCELED') {
            throw new BadRequestException('Booking is already canceled');
        }
        booking.status = 'CANCELED';
        
        return { message: 'Booking canceled successfuly' };
    }

    
    findBookingById(bookingId: string): Booking {
        const booking = this.bookings.find((b) => b.bookingId === bookingId);
        if (!booking) {
        throw new NotFoundException('Booking not found');
        }
        return booking;
    }
}