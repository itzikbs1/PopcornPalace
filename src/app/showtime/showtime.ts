import { IsString, IsDate, IsNumber, IsNotEmpty } from "class-validator";

export class ShowTime {
    //temporary
    id: number;
    @IsString()
    @IsNotEmpty()
    movie: string;

    @IsString()
    @IsNotEmpty()
    theater: string;

    @IsDate()
    start_time: Date;

    @IsDate()
    end_time: Date;

    @IsNumber()
    price: number;

    constructor(
        movie: string,
        theater: string,
        start_time: Date,
        end_time: Date,
        price: number
    ) {
        this.movie = movie;
        this.theater = theater;
        this.start_time = start_time;
        this.end_time = end_time;
        this.price = price;
    }
}