import { IsInt, IsString, IsNumber, IsNotEmpty } from "class-validator";


export class ShowTime {
    
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsInt()
    @IsNotEmpty()
    movieId: number;

    @IsString()
    @IsNotEmpty()
    theater: string;

    @IsNotEmpty()
    @IsString()
    startTime: Date;

    @IsNotEmpty()
    @IsString()
    endTime: Date;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    bookings: string[] = [];

    constructor(
        movieId: number,
        theater: string,
        startTime: Date,
        endTime: Date,
        price: number,
        bookings?: string[]
    ) {
        this.movieId = movieId;
        this.theater = theater;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.bookings = bookings ?? [];
    }
}