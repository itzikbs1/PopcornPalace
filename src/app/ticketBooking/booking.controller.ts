import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ShowTimeService } from '../showtime/showtime.service';
import { CreateBookingDto } from './create-booking';

@Controller('bookings')
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly showtimeService: ShowTimeService, 
    ) {}

    @Post()
    async createBooking(
    @Body() data: CreateBookingDto): Promise<{ bookingId: string }> {
        const booking = await this.bookingService.createBooking(data);
        return { bookingId: booking.bookingId };
    }

    // @Post()
    // createBooking(@Body() dto: CreateBookingDto): {"bookingId": string} {
    //     return this.bookingService.createBooking(dto);
    // }

    // @Patch(':bookingId/cancel')
    // cancelBooking(@Body() bookingId: string): { message: string } {
    //     return this.bookingService.cancelBooking(bookingId);
    // }

    // @Get(':bookingId')
    // getBooking(@Param('bookingId') bookingId: string): Booking {
    //     return this.bookingService.findBookingById(bookingId);
    // }
}