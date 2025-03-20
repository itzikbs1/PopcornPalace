import { IsString, IsDate, IsNumber, IsNotEmpty } from "class-validator";
import { Transform, Type } from 'class-transformer';

// import { Booking } from "../ticketBooking/booking";

export class ShowTime {
    //temporary
    @IsNotEmpty()
    movieId: number;
    // @IsString()
    // @IsNotEmpty()
    // movie: string;

    @IsString()
    @IsNotEmpty()
    theater: string;

    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => value ? new Date(value) : undefined, { toClassOnly: true })
    startTime: Date;

    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => value ? new Date(value) : undefined, { toClassOnly: true })
    endTime: Date;

    @IsNumber()
    price: number;

    bookings: String[]; // One-to-Many relation, holds bookings related to this showtime

    constructor(
        // movie: string,
        movieId: number,
        theater: string,
        startTime: Date,
        endTime: Date,
        price: number,
        bookings: String[] = []
    ) {
        // this.movie = movie;
        this.movieId = movieId;
        this.theater = theater;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.bookings = bookings;
    }
}