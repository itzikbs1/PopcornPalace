import { IsInt, IsOptional, IsDate, IsNumber, IsPositive, isString, IsString } from 'class-validator';

export class UpdateShowtimeDto {
    @IsOptional()
    @IsInt({ message: 'Movie ID must be an integer' })
    movieId?: number;

    @IsOptional()
    @IsDate({ message: 'Start time must be a valid date' })
    startTime?: Date;

    @IsOptional()
    @IsDate({ message: 'End time must be a valid date' })
    endTime?: Date;

    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    @IsPositive({ message: 'Price must be a positive value' })
    price?: number;

    @IsOptional()
    @IsString()
    theater?: string;

    constructor(partial: Partial<UpdateShowtimeDto>) {
        Object.assign(this, partial);
    }
}
