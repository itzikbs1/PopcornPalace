import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './app/movie/movie.module';
import { ShowTimeModule } from './app/showtime/showtime.module';
import { BookingModule } from './app/ticketBooking/booking.module';
import { UserModule } from './app/users/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MovieModule, ShowTimeModule, BookingModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
