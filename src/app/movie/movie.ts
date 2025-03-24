import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateMovieDto {
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @IsNotEmpty({ message: 'Genre is required' })
    @IsString({ message: 'Genre must be a string' })
    genre: string;

    @IsNotEmpty({ message: 'Duration is required' })
    @IsInt({ message: 'Duration must be an integer' })
    @Min(1, { message: 'Duration must be a positive number' })
    duration: number;

    @IsNotEmpty({ message: 'Rating is required' })
    @Min(0, { message: 'Rating must be at least 0' })
    @Max(10, { message: 'Rating cannot be more than 10' })
    rating: number;

    @IsNotEmpty({ message: 'Release year is required' })
    @IsInt({ message: 'Release year must be an integer' })
    @Min(1900, { message: 'Release year must be after 1900' })
    @Max(new Date().getFullYear(), { message: `Release year cannot be in the future` })
    releaseYear: number;
}