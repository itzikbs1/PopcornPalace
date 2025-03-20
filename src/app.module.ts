import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './app/movie/movie.module';
import { ShowTimeModule } from './app/showtime/showtime.module';

@Module({
  imports: [MovieModule, ShowTimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
