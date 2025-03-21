import { Module } from "@nestjs/common";

import { ShowTimeController } from "./showtime.controller";
import { ShowTimeService } from "./showtime.service";
import { MovieModule } from "../movie/movie.module";

@Module({
    imports: [MovieModule],
    controllers: [ShowTimeController],
    providers: [ShowTimeService],
    exports: [ShowTimeService]
})

export class ShowTimeModule {}