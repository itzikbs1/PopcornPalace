import { IsString, IsDate, IsNumber, IsNotEmpty } from "class-validator";
import { Transform, Type } from 'class-transformer';

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

    constructor(
        // movie: string,
        movieId: number,
        theater: string,
        startTime: Date,
        endTime: Date,
        price: number
    ) {
        // this.movie = movie;
        this.movieId = movieId;
        this.theater = theater;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
    }
}