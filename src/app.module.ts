import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './app/movie/movie.module';
import { ShowTimeModule } from './app/showtime/showtime.module';
import { BookingModule } from './app/ticketBooking/booking.module';
import { UserModule } from './app/users/user.module';

@Module({
  imports: [MovieModule, ShowTimeModule, BookingModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
