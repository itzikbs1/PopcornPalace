import { Controller, Post, Body, Param, Get, HttpCode } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './create-booking';
import { Booking } from '@prisma/client';

@Controller('bookings')
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
    ) {}

    @Post()
    @HttpCode(200)
    async createBooking(@Body() data: CreateBookingDto): Promise<{ bookingId: string }> {
        const booking = await this.bookingService.createBooking(data);
        return { bookingId: booking.bookingId };
    }

    @Get(':bookingId')
    getBooking(@Param('bookingId') bookingId: string): Promise<Booking> {
        return this.bookingService.getBookingById(bookingId);
    }
}