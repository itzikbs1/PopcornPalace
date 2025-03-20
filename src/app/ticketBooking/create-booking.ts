import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  showtimeId: number;

  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsUUID()
  userId: string;
}