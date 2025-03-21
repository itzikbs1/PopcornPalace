import { IsString, IsInt, Min, Max, IsNumber, IsNotEmpty } from 'class-validator';

export class Movie {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    genre: string;
    
    @IsInt()
    @Min(0)
    duration: number;

    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @IsInt()
    // @Min(0)
    release_year: number;

    constructor(
        // id: number,
        title: string, 
        genre: string, 
        duration: number, 
        rating: number, 
        release_year: number
    ) {
        // this.id = id;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.rating = rating;
        this.release_year = release_year;
    }
}

// export default Movie;