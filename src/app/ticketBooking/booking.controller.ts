import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './create-booking';
import { Booking } from './booking';
import { ShowTimeService } from '../showtime/showtime.service';

@Controller('bookings')
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly showtimeService: ShowTimeService, 
    ) {}

    @Post()
    createBooking(@Body() dto: CreateBookingDto): String {
        return this.bookingService.createBooking(dto);
    }

    @Patch(':bookingId/cancel')
    cancelBooking(@Body() bookingId: string): { message: string } {
        return this.bookingService.cancelBooking(bookingId);
    }

    @Get(':bookingId')
    getBooking(@Param('bookingId') bookingId: string): Booking {
        return this.bookingService.findBookingById(bookingId);
    }
}