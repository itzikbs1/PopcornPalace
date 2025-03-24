

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
        status: 'CONFIRMED' | 'CANCELED',
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