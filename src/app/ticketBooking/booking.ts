

export class Booking {
    bookingId: string; // Unique booking ID
    showtimeId: number; // Foreign key to Showtimes table
    seatNumber: number; // Seat number
    userId: string; // User ID (UUID)
    status: 'CONFIRMED' | 'CANCELED'; // Booking status
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