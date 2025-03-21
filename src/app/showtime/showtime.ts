import { IsInt, IsString, IsDate, IsNumber, IsNotEmpty } from "class-validator";
import { Transform, Type } from 'class-transformer';

// import { Booking } from "../ticketBooking/booking";

export class ShowTime {
    
    @IsInt()
    @IsNotEmpty()
    id: number;
    //temporary
    @IsInt()
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
    @IsNotEmpty()
    startTime: Date;

    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => value ? new Date(value) : undefined, { toClassOnly: true })
    @IsNotEmpty()
    endTime: Date;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    bookings: string[] = []; // One-to-Many relation, holds bookings related to this showtime

    constructor(
        // movie: string,
        movieId: number,
        theater: string,
        startTime: Date,
        endTime: Date,
        price: number,
        bookings?: string[]
    ) {
        // this.movie = movie;
        this.movieId = movieId;
        this.theater = theater;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.bookings = bookings ?? [];
    }
}