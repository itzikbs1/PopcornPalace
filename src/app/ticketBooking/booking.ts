

export class Booking {
    bookingId: string;
    showtimeId: number; 
    seatNumber: number;
    userId: string;
    status: 'CONFIRMED' | 'CANCELED';
    createdAt: Date;
    constructor(
        bookingId: string,
        showtimeId: number,
        seatNumber: number,
        userId: string,
        status: 'CONFIRMED' | 'CANCELED', // Default to 'pending'
        createdAt?: Date
      ) {
        this.bookingId = bookingId;
        this.showtimeId = showtimeId;
        this.seatNumber = seatNumber;
        this.userId = userId;
        this.status = status;
        this.createdAt = createdAt || new Date();
      }
    }
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Genereted } from 'typeorm';
// import { ShowTime } from '../showtime/showtime'; //maybe change to showtime.entity

// @Entity()
// export class Booking {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @ManyToOne(() => ShowTime, (showtime) => showtime.bookings)
//     showtimeId: number;

//     @Column()
//     seatNumber: number;

//     @Column({ type: 'uuid' })
//     userId: string;

//     @Column({ type: 'enum', enum: ['CONFIRMED', 'CANCELED'], default: 'CONFIRMED'})
//     status: 'CONFIRMED' | 'CANCELED'
// }