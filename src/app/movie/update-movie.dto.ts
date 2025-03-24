import { IsOptional, IsString, IsInt, IsNumber, Min, Max } from 'class-validator';

export class UpdateMovieDto {
    @IsOptional() // 🔹 Allows this field to be omitted, but if provided, it must be a string
    @IsString({ message: 'Title must be a string' })
    title?: string;

    @IsOptional()
    @IsString({ message: 'Genre must be a string' })
    genre?: string;

    @IsOptional()
    @IsInt({ message: 'Duration must be an integer' })
    @Min(1, { message: 'Duration must be a positive number' })
    duration?: number;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Rating must be at least 0' })
    @Max(10, { message: 'Rating cannot be more than 10' })
    rating?: number;

    @IsOptional()
    @IsInt({ message: 'Release year must be an integer' })
    // @Min(1900, { message: 'Release year must be after 1900' })
    @Max(new Date().getFullYear(), { message: `Release year cannot be in the future` })
    releaseYear?: number;
}
