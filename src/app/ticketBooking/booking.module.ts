import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ShowTimeModule } from '../showtime/showtime.module';
import { UserModule } from '../users/user.module';

@Module({
    imports: [ShowTimeModule, UserModule],
    controllers: [BookingController],
    providers: [BookingService],
})
export class BookingModule {}