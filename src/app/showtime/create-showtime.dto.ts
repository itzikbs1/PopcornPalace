import { IsInt, IsNotEmpty, IsPositive, IsDate, IsNumber, IsString, IsDefined } from 'class-validator';

export class CreateShowtimeDto {
    @IsDefined({ message: 'Movie ID is required' })
    @IsInt({ message: 'Movie ID must be an integer' })
    movieId: number;

    @IsDefined({ message: 'Start time is required' })
    @IsDate({ message: 'Start time must be a valid date' })
    startTime: Date;

    @IsDefined({ message: 'End time is required' })
    @IsDate({ message: 'End time must be a valid date' })
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
