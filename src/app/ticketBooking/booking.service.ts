import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from "uuid";

import { CreateBookingDto } from './create-booking';
import { Booking } from './booking';
import { ShowTimeService } from '../showtime/showtime.service';
import { UserService } from '../users/user.service';

@Injectable()
export class BookingService {
    private bookings: Booking[] = [
        new Booking(uuidv4(), 1, 15, "john.doe@example.com", "CONFIRMED"),
        new Booking(uuidv4(), 2, 8, "jane.smith@example.com", "CANCELED"),
        new Booking(uuidv4(), 3, 21, "alice.j@example.com", "CONFIRMED"),
    ];

    constructor(private readonly showtimeService: ShowTimeService, private readonly userService: UserService) {}

    createBooking(dto: CreateBookingDto): {"bookingId": string} {
        const { showtimeId, seatNumber, userId } = dto;

        const showtime = this.showtimeService.getShowTimeById(showtimeId)
        
        if (!showtime) {
            throw new NotFoundException('Showtime not found.');
        }
        
        const currentTime = new Date();
        if (currentTime >= showtime.startTime) {
            throw new BadRequestException('Booking is not allowed. Showtime has already started.');
        }
        
        const users = this.userService.getAllUsers();
        let findUser = false;
        for(const user of users) {
            if (user.id === userId) {
                findUser = true;
            } 
        }
        if (!findUser) {
            throw new NotFoundException('User not found');
        }

        const exsitingBooking = this.bookings.find(
            (booking) => booking.showtimeId === showtimeId && booking.seatNumber === seatNumber
        );

        if (exsitingBooking) {
            if(exsitingBooking.userId === userId) {
                throw new BadRequestException('You are already booked this seat.');
            }
            throw new BadRequestException('Seat already booked');
        }

        const newBooking = new Booking(
            Date.now().toString(),
            showtimeId,
            seatNumber,
            userId,
            'CONFIRMED'
        );
        this.bookings.push(newBooking);

        showtime.bookings.push(newBooking.bookingId);
        
        return {"bookingId": newBooking.bookingId};
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