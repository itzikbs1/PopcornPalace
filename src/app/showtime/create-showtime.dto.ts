import { IsInt, IsNotEmpty, IsPositive, IsNumber, IsString, IsDefined } from 'class-validator';

export class CreateShowtimeDto {
    @IsDefined({ message: 'Movie ID is required' })
    @IsInt({ message: 'Movie ID must be an integer' })
    movieId: number;

    @IsDefined({ message: 'Start time is required' })
    @IsString({ message: 'Start time must be a valid string' })
    startTime: Date;

    @IsDefined({ message: 'End time is required' })
    @IsString({ message: 'End time must be a valid string' })
    endTime: Date;

    @IsDefined({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    @IsPositive({ message: 'Price must be a positive value' })
    price: number;

    @IsDefined({ message: 'Theater name is required' })
    @IsString({ message: 'Theater must be a string' })
    @IsNotEmpty({ message: 'Theater cannot be empty' })
    theater: string;
}
